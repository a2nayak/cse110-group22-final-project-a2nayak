/**
 * storage.js
 *
 * Serves as an I/O layer to access localStorage data

 * Main responsibilities:
 * - Save/Load Player Profile
 * - Save/Load Game State
 * - Clear Profiles and State
 * - Manage Active Profile
 *
 * Dependencies:
 * - scoring.js: getScore(), getStreak()
 * - timer.js: GetAllTimerRecords(), GetCurrentTimerSettings()
 * 
 * Version 1.0 : 5/17/2026
 * Sprint : 2 
 * 
 * Overview: docs/storage-overview.md
 * File: src/prototype/js/storage.js
 * Tests: tests/storage.test.js
 */

const MAX_PROFILES = 4;
const ACTIVE_KEY = "activeProfile";

// Produces key to access respective player/state localStorage data via slot id
// Ex. id = 0 -> PLAYER_KEY(0) = "player_0", STATE_KEY(0) = "state_0"
const PLAYER_KEY = (id) => `player_${id}`;
const STATE_KEY = (id) => `state_${id}`;

/**
 * @typedef {Object} PlayerProfile
 * @property {string} name
 * @property {string|null} createdAt
 * @property {number} highScore
 * @property {number} totalGamesPlayed
 * @property {boolean} isInitialized
 */
//TODO: Add additional profile data as we flesh out features
const DEFAULT_PLAYER = {
    name: "",
    createdAt: null,
    highScore: 0,
    totalGamesPlayed: 0,
    isInitialized: false,
};

/**
 * @typedef {Object} GameState
 * @property {Array|null} questions - null on save, repopulated from questions.json on load
 * @property {Object|null} currentQuestion - null on save, derived after load
 * @property {number|null} totalQuestions - null on save, derived from questions.length
 * @property {number} score
 * @property {number} answeredQuestions
 * @property {Array} usedIndexes - stored as Array (Set is not JSON serializable)
 * @property {string|null} savedAt
 */
const DEFAULT_STATE = {
    questions: null,
    currentQuestion: null,
    totalQuestions: null,
    score: 0,
    answeredQuestions: 0,
    usedIndexes: [],
    savedAt: null,
};

// -------- Active Profile --------
// Functions allow program to remember last-used profile/state
// Unnecessary until multi-profiles are implemented

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

// -------- Profile Initialization --------

/**
 * Initializes all 4 profile slots in localStorage if they don't exist yet.
 * Should be called once on page load.
 */
export function initializeProfiles() {
    for (let i = 0; i < MAX_PROFILES; i++) {
        if (!localStorage.getItem(PLAYER_KEY(i))) {
            localStorage.setItem(PLAYER_KEY(i), JSON.stringify({ ...DEFAULT_PLAYER }));
        }
    }
}

// -------- Player Profile --------
// For now, with single profile implementation, id = 0 can be used generically

/**
 * Loads the player profile for the given slot id.
 * Returns an uninitialized default profile if the slot doesn't exist.
 * @param {number} id - Profile slot (0-3)
 * @returns {PlayerProfile}
 */
export function loadPlayer(id) {
    return JSON.parse(localStorage.getItem(PLAYER_KEY(id))) ?? { ...DEFAULT_PLAYER };
}

/**
 * Creates a new initialized player profile at the given slot id.
 * @param {number} id - Profile slot (0-3)
 * @returns {PlayerProfile} The newly created player profile.
 */
export function createPlayer(id) {
    const newPlayer = { ...DEFAULT_PLAYER, isInitialized: true, createdAt: new Date().toISOString() };
    savePlayer(newPlayer, id);
    return newPlayer;
}

/**
 * Saves the player profile to localStorage.
 * @param {PlayerProfile} playerData
 * @param {number} id - Profile slot (0-3)
 * @returns {boolean} True if player profile saved successfully, false otherwise.
 */
export function savePlayer(playerData, id) {
    try {
        localStorage.setItem(PLAYER_KEY(id), JSON.stringify(playerData));
        return true;
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            console.warn("localStorage is full, player data could not be saved.", e);
        } else {
            console.warn("Failed to save player data.", e);
        }
        return false;
    }
}

/**
 * Resets a profile slot to uninitialized default and clears the associated state.
 * @param {number} id - Profile slot (0-3)
 */
export function clearPlayer(id) {
    localStorage.setItem(PLAYER_KEY(id), JSON.stringify({ ...DEFAULT_PLAYER }));
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
    return JSON.parse(localStorage.getItem(STATE_KEY(id))) ?? { ...DEFAULT_STATE };
}

/**
 * Saves the engine state to localStorage for the given profile slot.
 * Strips non-serializable fields (questions, currentQuestion, totalQuestions) before saving.
 * usedIndexes is converted from Set to Array automatically.
 * Sets savedAt automatically.
 * @param {Object} state - The engine state object
 * @param {number} id - Profile slot (0-3)
 * @returns {boolean} True if state saved successfully, false otherwise.
 */
export function saveState(state, id) {
    try {
        const snapshot = {
            questions: null,
            currentQuestion: null,
            totalQuestions: null,
            score: state.score,
            answeredQuestions: state.answeredQuestions,
            usedIndexes: Array.from(state.usedIndexes),
            savedAt: new Date().toISOString(),
        };
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
 * Removes all player profiles, game states, and active profile data from localStorage.
 */
export function clearAll() {
    for (let i = 0; i < MAX_PROFILES; i++) {
        localStorage.removeItem(PLAYER_KEY(i));
        localStorage.removeItem(STATE_KEY(i));
    }
    localStorage.removeItem(ACTIVE_KEY);
}
