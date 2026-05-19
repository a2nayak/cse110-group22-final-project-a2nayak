/*
Test file for storage.js

Version 1.1 : 5/17/2026
Sprint : 2 

Overview: docs/storage-overview.md
File: src/prototype/js/storage.js
Tests: tests/storage.test.js
*/

// Import functions for unit-testing
import { loadProfile, saveProfile, createProfile, clearProfile, loadState, saveState, clearState, clearAll, loadActiveProfileId, saveActiveProfileId, initializeProfiles } from '../src/prototype/js/storage.js';

// localStorageMock is implemented first to simulate localStorage functions in Node
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

// Replace localStorage calls with localStorageMock
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Clear localStorage and suppress console warnings between tests
beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const TEST_PROFILE = { name: "Ben", highScore: 1234, totalGamesPlayed: 123, createdAt: "2026-05-17T10:23:00.000Z", isInitialized: true };
const TEST_STATE = { score: 300, answeredQuestions: 3, usedIndexes: new Set([0, 1, 2]) };

describe('initializeProfiles', () => {
    test('creates all 4 profile slots', () => {
        initializeProfiles();
        expect(loadProfile(0)).not.toBeNull();
        expect(loadProfile(1)).not.toBeNull();
        expect(loadProfile(2)).not.toBeNull();
        expect(loadProfile(3)).not.toBeNull();
    });

    test('all slots start as uninitialized', () => {
        initializeProfiles();
        expect(loadProfile(0).isInitialized).toBe(false);
        expect(loadProfile(1).isInitialized).toBe(false);
    });

    test('does not overwrite existing profiles', () => {
        initializeProfiles();
        saveProfile(TEST_PROFILE, 0);
        initializeProfiles();
        expect(loadProfile(0).name).toBe("Ben");
    });
});

describe('loadActiveProfileId', () => {
    test('returns null when no active profile is set', () => {
        expect(loadActiveProfileId()).toBeNull();
    });

    test('returns correct id after saveActiveProfileId is called', () => {
        saveActiveProfileId(2);
        expect(loadActiveProfileId()).toBe(2);
    });
});

describe('saveActiveProfileId', () => {
    test('correctly saves active profile id', () => {
        saveActiveProfileId(1);
        expect(loadActiveProfileId()).toBe(1);
    });
});

describe('loadProfile', () => {
    test('returns default profile when slot is empty', () => {
        const profile = loadProfile(0);
        expect(profile.isInitialized).toBe(false);
        expect(profile.name).toBe("");
    });

    test('correctly loads profile data when profile exists', () => {
        saveProfile(TEST_PROFILE, 0);
        const profile = loadProfile(0);
        expect(profile.name).toBe("Ben");
        expect(profile.highScore).toBe(1234);
        expect(profile.isInitialized).toBe(true);
    });
});

describe('createProfile', () => {
    test('creates a player with isInitialized set to true', () => {
        expect(createProfile(0).isInitialized).toBe(true);
    });

    test('sets createdAt automatically', () => {
        expect(createProfile(0).createdAt).not.toBeNull();
    });

    test('persists to localStorage', () => {
        createProfile(0);
        expect(loadProfile(0).isInitialized).toBe(true);
    });
});

describe('saveProfile', () => {
    test('returns true when valid profile is saved', () => {
        expect(saveProfile(TEST_PROFILE, 0)).toBe(true);
    });

    test('correctly saves profile data after call', () => {
        saveProfile(TEST_PROFILE, 0);
        const profile = loadProfile(0);
        expect(profile.name).toBe("Ben");
        expect(profile.highScore).toBe(1234);
        expect(profile.totalGamesPlayed).toBe(123);
    });

    test('saves to correct slot', () => {
        saveProfile(TEST_PROFILE, 0);
        saveProfile({ ...TEST_PROFILE, name: "Sean" }, 1);
        expect(loadProfile(0).name).toBe("Ben");
        expect(loadProfile(1).name).toBe("Sean");
    });

    // Simulates a QuotaExceededError from localStorage
    test('returns false when localStorage is full', () => {
        jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
        });
        expect(saveProfile(TEST_PROFILE, 0)).toBe(false);
    });
});

describe('loadState', () => {
    test('returns default state when no state exists', () => {
        const state = loadState(0);
        expect(state.score).toBe(0);
        expect(state.answeredQuestions).toBe(0);
        expect(state.usedIndexes).toEqual(new Set());
        expect(state.savedAt).toBeNull();
        expect(state.questions).toEqual([]);
        expect(state.currentQuestion).toBeNull();
        expect(state.totalQuestions).toBe(0);
    });

    test('correctly loads state data when state exists', () => {
        saveState(TEST_STATE, 0);
        const state = loadState(0);
        expect(state.score).toBe(300);
        expect(state.answeredQuestions).toBe(3);
        expect(state.usedIndexes).toEqual([0, 1, 2]);
    });

    test('states are slot-specific', () => {
        saveState(TEST_STATE, 0);
        expect(loadState(1).score).toBe(0);
    });
});

describe('saveState', () => {
    test('returns true when valid state is saved', () => {
        expect(saveState(TEST_STATE, 0)).toBe(true);
    });

    test('correctly saves state data after call', () => {
        saveState(TEST_STATE, 0);
        const state = loadState(0);
        expect(state.score).toBe(300);
        expect(state.answeredQuestions).toBe(3);
        expect(state.usedIndexes).toEqual([0, 1, 2]);
    });

    test('savedAt is set automatically on save', () => {
        saveState(TEST_STATE, 0);
        expect(loadState(0).savedAt).not.toBeNull();
    });

    test('strips non-serializable fields', () => {
        saveState({ ...TEST_STATE, questions: [{ prompt: "test" }], currentQuestion: {}, totalQuestions: 30 }, 0);
        const state = loadState(0);
        expect(state.questions).toBeNull();
        expect(state.currentQuestion).toBeNull();
        expect(state.totalQuestions).toBeNull();
    });

    test('converts usedIndexes Set to Array', () => {
        saveState(TEST_STATE, 0);
        expect(Array.isArray(loadState(0).usedIndexes)).toBe(true);
    });

    // Simulates a QuotaExceededError from localStorage
    test('returns false when localStorage is full', () => {
        jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
        });
        expect(saveState(TEST_STATE, 0)).toBe(false);
    });
});

describe('clearState', () => {
    test('removes state data for the given slot', () => {
        saveState(TEST_STATE, 0);
        clearState(0);
        expect(loadState(0).score).toBe(0);
    });

    test('does not affect other slots', () => {
        saveState(TEST_STATE, 0);
        saveState(TEST_STATE, 1);
        clearState(0);
        expect(loadState(1).score).toBe(300);
    });

    test('does not affect profile data', () => {
        saveProfile(TEST_PROFILE, 0);
        clearState(0);
        expect(loadProfile(0).name).toBe("Ben");
    });
});

describe('clearProfile', () => {
    test('resets player slot to uninitialized', () => {
        saveProfile(TEST_PROFILE, 0);
        clearProfile(0);
        expect(loadProfile(0).isInitialized).toBe(false);
        expect(loadProfile(0).name).toBe("");
    });

    test('also clears associated state', () => {
        saveState(TEST_STATE, 0);
        clearProfile(0);
        expect(loadState(0).score).toBe(0);
    });

    test('does not affect other slots', () => {
        saveProfile(TEST_PROFILE, 0);
        saveProfile({ ...TEST_PROFILE, name: "Sean" }, 1);
        clearProfile(0);
        expect(loadProfile(1).name).toBe("Sean");
    });
});

describe('clearAll', () => {
    test('removes all profile and state data', () => {
        initializeProfiles();
        saveProfile(TEST_PROFILE, 0);
        saveState(TEST_STATE, 0);
        clearAll();
        expect(loadProfile(0).isInitialized).toBe(false);
        expect(loadState(0).score).toBe(0);
    });

    test('clears active profile id', () => {
        saveActiveProfileId(0);
        clearAll();
        expect(loadActiveProfileId()).toBeNull();
    });
});
