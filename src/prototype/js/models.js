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
 * @property {string} name - Display name set by the user
 * @property {string|null} createdAt - ISO timestamp of profile creation
 * @property {number} highScore - All-time high score
 * @property {number} totalGamesPlayed - Total completed games
 * @property {boolean} isInitialized - False = empty slot, true = real profile
 */

/** @returns {Profile} */
export function defaultProfile() {
  return {
    name: "",
    createdAt: null,
    highScore: 0,
    totalGamesPlayed: 0,
    isInitialized: false,
  };
}

/**
 * @typedef {Object} GameState
 * @property {number} score - Current game score
 * @property {number} answeredQuestions - Number of questions answered so far
 * @property {Set<number>} usedIndexes - Question indexes already seen this session
 * @property {string|null} savedAt - ISO timestamp of last save, null if no save exists
 * @property {Array} questions - Full question list loaded from JSON (not persisted)
 * @property {Object|null} currentQuestion - The active question object (not persisted)
 * @property {number} totalQuestions - Total number of questions (not persisted)
 */

/** @returns {GameState} */
export function defaultGameState() {
  return {
    score: 0,
    answeredQuestions: 0,
    usedIndexes: new Set(),
    savedAt: null,
    questions: [],
    currentQuestion: null,
    totalQuestions: 0,
  };
}