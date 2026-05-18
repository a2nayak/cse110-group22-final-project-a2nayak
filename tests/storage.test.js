// Import functions for unit-testing
import { loadPlayer, savePlayer, createPlayer, clearPlayer, loadState, saveState, clearState, clearAll, loadActiveProfileId, saveActiveProfileId, initializeProfiles } from '../src/prototype/js/storage.js';

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

const TEST_PLAYER = { name: "Ben", highScore: 1234, totalGamesPlayed: 123, createdAt: "2026-05-17T10:23:00.000Z", isInitialized: true };
const TEST_STATE = { score: 300, answeredQuestions: 3, usedIndexes: new Set([0, 1, 2]) };

describe('initializeProfiles', () => {
    test('creates all 4 profile slots', () => {
        initializeProfiles();
        expect(loadPlayer(0)).not.toBeNull();
        expect(loadPlayer(1)).not.toBeNull();
        expect(loadPlayer(2)).not.toBeNull();
        expect(loadPlayer(3)).not.toBeNull();
    });

    test('all slots start as uninitialized', () => {
        initializeProfiles();
        expect(loadPlayer(0).isInitialized).toBe(false);
        expect(loadPlayer(1).isInitialized).toBe(false);
    });

    test('does not overwrite existing profiles', () => {
        initializeProfiles();
        savePlayer(TEST_PLAYER, 0);
        initializeProfiles();
        expect(loadPlayer(0).name).toBe("Ben");
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

describe('loadPlayer', () => {
    test('returns default player when slot is empty', () => {
        const player = loadPlayer(0);
        expect(player.isInitialized).toBe(false);
        expect(player.name).toBe("");
    });

    test('correctly loads player data when profile exists', () => {
        savePlayer(TEST_PLAYER, 0);
        const player = loadPlayer(0);
        expect(player.name).toBe("Ben");
        expect(player.highScore).toBe(1234);
        expect(player.isInitialized).toBe(true);
    });
});

describe('createPlayer', () => {
    test('creates a player with isInitialized set to true', () => {
        expect(createPlayer(0).isInitialized).toBe(true);
    });

    test('sets createdAt automatically', () => {
        expect(createPlayer(0).createdAt).not.toBeNull();
    });

    test('persists to localStorage', () => {
        createPlayer(0);
        expect(loadPlayer(0).isInitialized).toBe(true);
    });
});

describe('savePlayer', () => {
    test('returns true when valid profile is saved', () => {
        expect(savePlayer(TEST_PLAYER, 0)).toBe(true);
    });

    test('correctly saves player data after call', () => {
        savePlayer(TEST_PLAYER, 0);
        const player = loadPlayer(0);
        expect(player.name).toBe("Ben");
        expect(player.highScore).toBe(1234);
        expect(player.totalGamesPlayed).toBe(123);
    });

    test('saves to correct slot', () => {
        savePlayer(TEST_PLAYER, 0);
        savePlayer({ ...TEST_PLAYER, name: "Sean" }, 1);
        expect(loadPlayer(0).name).toBe("Ben");
        expect(loadPlayer(1).name).toBe("Sean");
    });

    // Simulates a QuotaExceededError from localStorage
    test('returns false when localStorage is full', () => {
        jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
        });
        expect(savePlayer(TEST_PLAYER, 0)).toBe(false);
    });
});

describe('loadState', () => {
    test('returns default state when no state exists', () => {
        const state = loadState(0);
        expect(state.score).toBe(0);
        expect(state.answeredQuestions).toBe(0);
        expect(state.usedIndexes).toEqual([]);
        expect(state.savedAt).toBeNull();
        expect(state.questions).toBeNull();
        expect(state.currentQuestion).toBeNull();
        expect(state.totalQuestions).toBeNull();
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

    test('does not affect player data', () => {
        savePlayer(TEST_PLAYER, 0);
        clearState(0);
        expect(loadPlayer(0).name).toBe("Ben");
    });
});

describe('clearPlayer', () => {
    test('resets player slot to uninitialized', () => {
        savePlayer(TEST_PLAYER, 0);
        clearPlayer(0);
        expect(loadPlayer(0).isInitialized).toBe(false);
        expect(loadPlayer(0).name).toBe("");
    });

    test('also clears associated state', () => {
        saveState(TEST_STATE, 0);
        clearPlayer(0);
        expect(loadState(0).score).toBe(0);
    });

    test('does not affect other slots', () => {
        savePlayer(TEST_PLAYER, 0);
        savePlayer({ ...TEST_PLAYER, name: "Sean" }, 1);
        clearPlayer(0);
        expect(loadPlayer(1).name).toBe("Sean");
    });
});

describe('clearAll', () => {
    test('removes all player and state data', () => {
        initializeProfiles();
        savePlayer(TEST_PLAYER, 0);
        saveState(TEST_STATE, 0);
        clearAll();
        expect(loadPlayer(0).isInitialized).toBe(false);
        expect(loadState(0).score).toBe(0);
    });

    test('clears active profile id', () => {
        saveActiveProfileId(0);
        clearAll();
        expect(loadActiveProfileId()).toBeNull();
    });
});
