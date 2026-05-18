/**
 * storage.js
 *
 * Serves as an I/O layer to access localStorage data

 * Main responsibilities:
 * - Save/Load Profile
 * - Save/Load Game State
 * - Clear Profiles and State
 * - Manage Active Profile
 *
 * Dependencies:
 * - models.js: defaultProfile(), defaultGameState()
 *
 * Version 1.1 : 5/17/2026
 * Sprint : 2 
 * 
 * Overview: docs/storage-overview.md
 * File: src/prototype/js/storage.js
 * Tests: tests/storage.test.js
 */

import { defaultProfile, defaultGameState } from './models.js';

const MAX_PROFILES = 4;
const ACTIVE_KEY = "activeProfile"; 
const PROFILE_KEY = (id) => `profile_${id}`; // Ex. PROFILE_KEY(0) = "profile_0"
const STATE_KEY = (id) => `state_${id}`; // Ex. STATE_KEY(0) = "state_0"

// -------- Active Profile --------
// Functions allow program to remember last-used profile/state

/**
 * Loads the active profile id from localStorage.
 * Should be called to bypass profile select if set.
 * @returns {number|null} The active profile id, or null if none is set.
 */
export function loadActiveProfileId() {
    const id = localStorage.getItem(ACTIVE_KEY);
    return id !== null ? Number(id) : null;
}

/**
 * Saves the active profile id to localStorage.
 * Should be called once after profile select.
 * Should be set to null before "exiting profile".
 * @param {number} id - Profile slot (0-3)
 */
export function saveActiveProfileId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
}

// -------- Profile --------

/**
 * Initializes all 4 profile slots in localStorage if they don't exist yet.
 * Should be called once on page load.
 */
export function initializeProfiles() {
    for (let i = 0; i < MAX_PROFILES; i++) {
        if (!localStorage.getItem(PROFILE_KEY(i))) {
            localStorage.setItem(PROFILE_KEY(i), JSON.stringify(defaultProfile()));
        }
    }
}

/**
 * Loads the profile for the given slot id.
 * Returns an uninitialized default profile if the slot doesn't exist.
 * @param {number} id - Profile slot (0-3)
 * @returns {Profile}
 */
export function loadProfile(id) {
    return JSON.parse(localStorage.getItem(PROFILE_KEY(id))) ?? defaultProfile();
}

/**
 * Creates a new initialized profile at the given slot id.
 * @param {number} id - Profile slot (0-3)
 * @returns {Profile} The newly created profile.
 */
export function createProfile(id) {
    const newProfile = { ...defaultProfile(), isInitialized: true, createdAt: new Date().toISOString() };
    saveProfile(newProfile, id);
    return newProfile;
}

/**
 * Saves the profile to localStorage.
 * @param {Profile} profile
 * @param {number} id - Profile slot (0-3)
 * @returns {boolean} True if profile saved successfully, false otherwise.
 */
export function saveProfile(profile, id) {
    try {
        localStorage.setItem(PROFILE_KEY(id), JSON.stringify(profile));
        return true;
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            console.warn("localStorage is full, profile data could not be saved.", e);
        } else {
            console.warn("Failed to save profile data.", e);
        }
        return false;
    }
}

/**
 * Resets a profile slot to uninitialized default and clears the associated state.
 * @param {number} id - Profile slot (0-3)
 */
export function clearProfile(id) {
    localStorage.setItem(PROFILE_KEY(id), JSON.stringify(defaultProfile()));
    clearState(id);
}

// -------- Game State --------

/**
 * Loads the game state for the given profile slot id.
 * Fields questions, currentQuestion, and totalQuestions are null — repopulate in engine after load.
 * usedIndexes is stored as an Array and must be converted back to a Set in the engine.
 * @param {number} id - Profile slot (0-3)
 * @returns {GameState} The saved state, or a fresh default if none exists.
 */
export function loadState(id) {
    return JSON.parse(localStorage.getItem(STATE_KEY(id))) ?? defaultGameState();
}

/**
 * Saves the engine state to localStorage for the given profile slot.
 * Strips runtime-only fields (questions, currentQuestion, totalQuestions) before saving.
 * usedIndexes is converted from Set to Array automatically.
 * Sets savedAt automatically.
 * @param {Object} state - The engine state object
 * @param {number} id - Profile slot (0-3)
 * @returns {boolean} True if state saved successfully, false otherwise.
 */
export function saveState(state, id) {
    try {
        const snapshot = { ...state };
        snapshot.questions = null;
        snapshot.currentQuestion = null;
        snapshot.totalQuestions = null;
        snapshot.usedIndexes = Array.from(state.usedIndexes);
        snapshot.savedAt = new Date().toISOString();
        localStorage.setItem(STATE_KEY(id), JSON.stringify(snapshot));
        return true;
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            console.warn("localStorage is full, state data could not be saved.", e);
        } else {
            console.warn("Failed to save state data.", e);
        }
        return false;
    }
}

/**
 * Removes game state for the given profile slot from localStorage.
 * @param {number} id - Profile slot (0-3)
 */
export function clearState(id) {
    localStorage.removeItem(STATE_KEY(id));
}

// -------- Nuclear options --------

/**
 * Removes all profiles, game states, and active profile data from localStorage.
 */
export function clearAll() {
    for (let i = 0; i < MAX_PROFILES; i++) {
        localStorage.removeItem(PROFILE_KEY(i));
        localStorage.removeItem(STATE_KEY(i));
    }
    localStorage.removeItem(ACTIVE_KEY);
}
