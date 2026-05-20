/**
 * models.js
 *
 * Single source of truth for data shapes used across the game.
 * Defines default structures for Profile and GameState as plain objects.
 * No logic or storage calls — shape definitions only.
 *
 * Imported by:
 * - storage.js: uses defaults when localStorage is empty
 * - game.js: initializes live state and profile
 */

/**
 * @typedef {Object} Profile
 * @property {string} name - Display name set by the user
 * @property {string|null} createdAt - ISO timestamp of profile creation
 * @property {number[]} highScores - Best score per level, index corresponds to level number (0-indexed)
 */

/** @returns {Profile} */
export function defaultProfile() {
  return {
    name: "",
    createdAt: null,
    highScores: [0, 0, 0, 0, 0],
  };
}

/**
 * @typedef {Object} GameState
 * @property {number} score - Current game score
 * @property {Array<*>} questions - Full question list loaded from questions.js (not persisted)
 * @property {number} currentQuestionIndex - Index of the active question in questions[]
 * @property {string} currentInput - What the player has typed so far for the current word (not persisted)
 * @property {number} timeRemaining - Seconds left in the current game
 */

/** @returns {GameState} */
export function defaultGameState() {
  return {
    score: 0,
    questions: [],
    currentQuestionIndex: 0,
    currentInput: "",
    timeRemaining: 60,
  };
}
