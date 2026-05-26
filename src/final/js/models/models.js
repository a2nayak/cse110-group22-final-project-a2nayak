/**
 * models.js
 *
 * Single source of truth for data shapes used across the game.
 * Defines default structures for Profile and GameState.
 * No logic or storage calls. Shape definitions only.
 * Fields can be added here without requiring behavior changes elsewhere.
 *
 * Imported by:
 * - storage.js: uses defaults when slots are uninitialized
 *
 * Overview: docs/models-overview.md
 */

/**
 * @typedef {Object} Profile
 * @property {string} username - The player's chosen username
 * @property {number} level - The player's current level
 * @property {number} num_questions_answered - Total questions answered by the player
 * @property {string} language - The player's preferred programming language
 * @property {number} score - The player's total accumulated score
 * @property {boolean} isInitialized - Flag indicating if the profile has been set up
 */
export function defaultProfile() {
  return {
    username: "Guest",
    score: 0,
    level: 1,
    num_questions_answered: 0,
    language: "Python",
  };
}

/**
 * @typedef {Object} GameState
 * Session-only data. Does NOT include the player profile.
 * Populated by level.js on each new level and reset between levels.
 * Safe to clear without affecting the persistent player profile.
 *
 * @property {int[]}     plants                 - Plant array holding plants indexed (0 - 2). Each plant has growth level stored as int at respective index.
 * @property {string[]}  questions              - Prompts for the current level (shuffled)
 * @property {string[]}  answers                - Answers parallel to questions[]
 * @property {number}    current_question_index - Index into questions[] / answers[]
 * @property {string}    current_input          - Player's in-progress input for the active question
 * @property {number}    incorrect_chars        - Wrong keystrokes for the current question (reset each question)
 * @property {number}    timer                  - Seconds left in game until timeout.
 * @property {number}    time_limit             - Total seconds allowed for the level
 * @property {number}    base_score                  - Points accumulated this session
 */

/** @returns {GameState} */
export function defaultGameState() {
  return {
    plants:                 [0, 0, 0],
    questions:              [],
    answers:                [],
    current_question_index: 0,
    current_input:          "",
    incorrect_chars:        0,
    timer:                  0,
    time_limit:             60,
    base_score:             0,
  };
}