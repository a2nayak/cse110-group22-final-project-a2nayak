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

let isActive = false;
let isPaused = false;

let uiHandler = null;

// UI registration
export function registerUI(handler) {
  uiHandler = handler;
}

function emitUpdate(type, meta = {}) {
  if (!uiHandler) return;

  uiHandler({
    type,
    state: structuredClone(state),
    meta
  });
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

  isActive = true;
  isPaused = false;

  startTimer(state.timer, _onTick, _onExpire);

  emitUpdate("GAME_START");
}

/**
 * Ends the current game session: stops the timer, accumulates session results
 * into the player profile, persists both, clears in-progress state, and
 * signals ui-core to show the end screen.
 *
 * Called internally (all questions done, or timer expired) or by ui.js (quit).
 */
export function endGame() {
  if (!isActive) return;

  stopTimer();
  isActive = false;

  player.score += calculateTotalScore(state);
  player.num_questions_answered += state.questions.length;
  saveProfile(player);
  emitUpdate("GAME_END");

  state = defaultGameState();
}

/**
 * Pauses the active countdown timer and loads the pause screen.
 */
export function pauseGame() {
  if (!isActive) return;

  isPaused = true;
  stopTimer();

  emitUpdate("PAUSE");
}

/**
 * Resumes the countdown timer and loads the game screen.
 */
export function resumeGame() {
   if (!isActive || !isPaused) return;

  isPaused = false;
  startTimer(state.timer, _onTick, _onExpire);
  emitUpdate("RESUME");
}

/**
 * Exits the current session and returns to the level select screen.
 * Stops the timer and discards in-progress state without saving.
 * Called when the player presses the level select button.
 */
export function goToLevelSelect() {
  stopTimer();
  state = defaultGameState();
  emitUpdate("LEVEL_SELECT");
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
// I presently doubt we even have a main menu button

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
 * @param {string} fullInput - The entire input string typed by the player
 */
export function onInput(fullInput) {
  if (!isActive || isPaused) return;

  const answer = state.answers[state.current_question_index];
  if (!answer) return;

  state.current_input = fullInput;

  const i = fullInput.length - 1;
  const typedChar = fullInput[i];

  // ignore backspace case (optional safety)
  if (i < 0) return;

  const isCorrect = typedChar === answer[i];

  if (isCorrect) {
    emitUpdate("INPUT_CORRECT", {
      index: i,
      char: typedChar
    });
  } else {
    state.incorrect_chars++;
    emitUpdate("INPUT_INCORRECT", {
      index: i,
      typedChar,
      expected: answer[i]
    });
  }

  // completion check
  if (fullInput === answer) {
    handleQuestionComplete();
  }
}

/**
 * Handles the end of a question
 */
function handleQuestionComplete() {
  state.base_score = calculateBaseScore(state);

  state.plants = growNextPlant(state);

  state.current_input = "";
  state.incorrect_chars = 0;

  state.current_question_index++;

  if (state.current_question_index >= state.questions.length) {
    endGame();
    return;
  }

  emitUpdate("QUESTION_ADVANCE");
}

// ── Timer callbacks (internal) ────────────────────────────────────────────────

/**
 * Fired every second by timer.js.
 * Updates state.timer and notifies ui-core to refresh the timer display.
 *
 * @param {number} timeRemaining - Seconds left on the clock
 */
function _onTick(timeRemaining) {
  if (!isActive || isPaused) return;
  state.timer = timeRemaining;
  callbacks.updateScreen("tick", { ...state });
}

/**
 * Fired by timer.js when the countdown reaches 0.
 */
function _onExpire() {
  if (!isActive || isPaused) return;
  endGame();
}
