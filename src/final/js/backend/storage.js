/**
 * storage.js
 *
 * I/O layer for localStorage. Single profile, single game state.
 *
 * Main responsibilities:
 * - Save/Load Profile
 * - Save/Load Game State
 * - Clear Profile and State
 *
 * Dependencies:
 * - models.js: defaultProfile(), defaultGameState()
 *
 * Tests: tests/storage.test.js
 */

import { defaultProfile, defaultGameState } from './models.js';

const PROFILE_KEY = "profile";
const STATE_KEY = "state";

// -------- Profile --------

/**
 * Loads the profile from localStorage.
 * Returns a default profile if none exists.
 * @returns {Profile}
 */
export function loadProfile() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) ?? defaultProfile();
}

/**
 * Saves the profile to localStorage.
 * @param {Profile} profile
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function saveProfile(profile) {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        return true;
    } catch (e) {
        console.warn("Failed to save profile.", e);
        return false;
    }
}

/**
 * Removes the profile from localStorage.
 */
export function clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
}

// -------- Game State --------

/**
 * Loads the game state from localStorage.
 * Returns a fresh default if none exists.
 * @returns {GameState} The saved state, or a fresh default if none exists.
 */
export function loadState() {
    return JSON.parse(localStorage.getItem(STATE_KEY)) ?? defaultGameState();
}

/**
 * Saves the game state to localStorage.
 * currentInput is reset to "" — no point saving a partially typed word.
 * All other fields (score, questions, currentQuestionIndex, timeRemaining) are persisted as-is.
 * @param {GameState} state - The game state object
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function saveState(state) {
    try {
        const snapshot = { ...state, currentInput: "" };
        localStorage.setItem(STATE_KEY, JSON.stringify(snapshot));
        return true;
    } catch (e) {
        console.warn("Failed to save state.", e);
        return false;
    }
}

/**
 * Removes the game state from localStorage.
 */
export function clearState() {
    localStorage.removeItem(STATE_KEY);
}

// -------- Nuclear options --------

/**
 * Removes profile and game state from localStorage.
 */
export function clearAll() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STATE_KEY);
}
