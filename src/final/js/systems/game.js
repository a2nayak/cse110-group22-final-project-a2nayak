/**
 * game.js
 *
 * Central game engine. Owns the active GameState and Profile, coordinates
 * all other modules, and exposes functions for ui.js to call.
 *
 * Main responsibilities:
 * - Initialize and own GameState as single source of truth
 * - Handle game lifecycle: startLevel(), endGame(), pauseGame(), resumeGame()
 * - Process player input (onInput) and update state accordingly
 * - Coordinate modules: level.js, scoring.js, timer.js, storage.js
 * - Fire callbacks back to ui-core.js after each state change
 *
 * Architecture:
 * - ui-core.js registers loadScreen / updateScreen callbacks on init
 * - game.js never touches the DOM directly — all UI updates go through callbacks
 * - state is the single source of truth
 *
 * Current question/answer are accessed by index:
 *   state.questions[state.current_question_index]
 *   state.answers[state.current_question_index]
 *
 * Advancing a question = state.current_question_index++
 *
 * state.timer counts down from time_limit to 0 (seconds remaining).
 * Elapsed time = state.time_limit - state.timer.
 *
 * Dependencies:
 * - level.js      : loadLevel(levelNumber, category)
 * - timer.js      : startTimer(), stopTimer()
 * - scoring.js    : calculateTotalScore()
 * - storage.js    : saveProfile(), saveState(), clearState()
 * - models/models.js : defaultGameState()
 *
 * Responses emitted via updateScreen():
 * - "correct-char"   → user typed a correct character 
 * - "incorrect"      → user typed a wrong character 
 * - "next-question"  → answer complete, next question ready
 * - "tick"           → timer fired, update timer display
 *
 * Screens emitted via loadScreen():
 * - "game"           → switch to game screen (level just started or resumed)
 * - "pause"          → switch to pause screen
 * - "endscreen"      → switch to end screen (time up or all questions done)
 * - "levelselect"    → switch to level select screen (player exits session)
 * - "mainmenu"       → switch to main menu (player exits session)
 */

import { loadLevel } from "./level.js";
import { startTimer, stopTimer } from "./timer.js";
import { calculateBaseScore, calculateTotalScore } from "./scoring.js";
import { saveProfile, clearState } from "./storage.js";
import { defaultGameState, defaultProfile } from "../models/models.js";
import { growNextPlant } from "./plants.js";

// ── Module-level state ────────────────────────────────────────────────────────

/**
 * Session state — reset each level via Object.assign(state, levelData).
 * Does not hold player data.
 * @type {ReturnType<typeof defaultGameState>}
 */
let state = defaultGameState();

/**
 * Persistent player profile — survives between levels.
 * Loaded from storage on init; saved to storage on endGame.
 * @type {ReturnType<typeof defaultProfile>}
 */
let player = defaultProfile();

/**
 * Callbacks registered by ui-core.js.
 * game.js fires these after processing each event.
 */
const callbacks = {
  /** @type {((screenName: string, data: object) => void)|null} */
  loadScreen: null,

  /** @type {((response: string, data: object) => void)|null} */
  updateScreen: null,
};

// ── Callback registration ─────────────────────────────────────────────────────

/**
 * Registers the UI callbacks that game.js fires after state changes.
 * Must be called once by ui-core.js on page load, before any user action.
 *
 * @param {(screenName: string, data: object) => void} loadScreen
 *   Called when game.js wants to switch to a different screen.
 * @param {(response: string, data: object) => void} updateScreen
 *   Called when game.js wants to update the current screen in-place.
 */
export function registerCallbacks(loadScreen, updateScreen) {
  callbacks.loadScreen = loadScreen;
  callbacks.updateScreen = updateScreen;
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

/**
 * Starts a level. Fetches and shuffles questions via level.js, merges the
 * result into state (replacing only level-specific fields), starts the timer,
 * and signals ui-core to show the game screen.
 *
 * Called by the level-select UI when the user picks a level.
 *
 * @param {number} levelNumber - 1-indexed level number
 * @param {string} category    - Question category slug, e.g. "python"
 */
export async function startLevel(levelNumber, category) {
  state = await loadLevel(levelNumber, category);

  // Start the countdown timer
  startTimer({ ...state }, _onTick, _onExpire);

  // Signal ui-core to transition to the game screen
  callbacks.loadScreen("game", { ...state });
}

/**
 * Ends the current game session: stops the timer, accumulates session results
 * into the player profile, persists both, clears in-progress state, and
 * signals ui-core to show the end screen.
 *
 * Called internally (all questions done, or timer expired) or by ui.js (quit).
 */
export function endGame() {
  stopTimer();

  // Accumulate session results into the persistent player profile
  player.score += calculateTotalScore(state.base_score, { ...state });
  player.num_questions_answered += state.current_question_index;

  // Persist profile, clear in-progress session state
  saveProfile(player);
  clearState();

  callbacks.loadScreen("endscreen", { ...state });
}

/**
 * Pauses the active countdown timer and loads the pause screen.
 */
export function pauseGame() {
  stopTimer();
  callbacks.loadScreen("pause", { ...state });
}

/**
 * Resumes the countdown timer and loads the game screen.
 */
export function resumeGame() {
  if (state.timer > 0) {
    startTimer({ ...state }, _onTick, _onExpire);
    callbacks.loadScreen("game", { ...state });
  }
}

/**
 * Exits the current session and returns to the level select screen.
 * Stops the timer and discards in-progress state without saving.
 * Called when the player presses the level select button.
 */
export function goToLevelSelect() {
  stopTimer();
  state = defaultGameState();
  callbacks.loadScreen("levelselect", { ...state });
}

/**
 * Exits the current session and returns to the main menu.
 * Stops the timer and discards in-progress state without saving.
 * Called when the player presses the main menu button.
 */
export function goToMainMenu() {
  stopTimer();
  state = defaultGameState();
  callbacks.loadScreen("mainmenu", { ...state });
}

// ── Game Input handling ────────────────────────────────────────────────────────────

/**
 * Called on every keypress in the code input field.
 * Checks the typed key against the expected next character in the current answer.
 *
 * ui.js wires this up like:
 *   inputEl.addEventListener("keyup", (e) => onInput(e.key));
 *
 * Responses fired:
 * - "incorrect"     → wrong character typed
 * - "correct-char"  → right character, answer not yet complete
 * - "next-question" → answer complete, index advanced to next question
 * - (endGame)       → answer complete and no more questions remain
 *
 * @param {string} key - Single character typed by the player (e.key)
 */
export function onInput(key) {
  const answer = state.answers[state.current_question_index];
  if (answer === undefined) return; // no active question

  const nextPos = state.current_input.length;

  // ── Wrong character ──────────────────────────────────────────────────────
  if (key !== answer[nextPos]) {
    state.incorrect_chars++;
    callbacks.updateScreen("incorrect", { ...state });
    return;
  }

  // ── Correct character ────────────────────────────────────────────────────
  state.current_input += key;

  if (state.current_input.length < answer.length) {
    callbacks.updateScreen("correct-char", { ...state });
    return;
  }

  // ── Answer complete ──────────────────────────────────────────────────────
  state.base_score = calculateBaseScore({ ...state });

  // Grow a plant after correct answer
  state.plants = growNextPlant({ ...state });

  // Reset per-question trackers
  state.current_input   = "";
  state.incorrect_chars = 0;

  // Advance index and check if level is complete
  state.current_question_index++;

  if (state.current_question_index < state.questions.length) {
    callbacks.updateScreen("next-question", { ...state });
  } else {
    endGame();
  }
}

// ── Timer callbacks (internal) ────────────────────────────────────────────────

/**
 * Fired every second by timer.js.
 * Updates state.timer and notifies ui-core to refresh the timer display.
 *
 * @param {number} timeRemaining - Seconds left on the clock
 */
function _onTick(timeRemaining) {
  state.timer = timeRemaining;
  callbacks.updateScreen("tick", { ...state });
}

/**
 * Fired by timer.js when the countdown reaches 0.
 */
function _onExpire() {
  endGame();
}
