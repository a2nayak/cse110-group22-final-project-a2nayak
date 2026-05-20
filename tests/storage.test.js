/*
Test file for storage.js
*/

import { loadProfile, saveProfile, clearProfile, loadState, saveState, clearState, clearAll } from '../src/final/js/backend/storage.js';

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const TEST_PROFILE = { name: "Ben", highScores: [100, 200, 300, 400, 500], createdAt: "2026-05-17T10:23:00.000Z" };
const TEST_QUESTIONS = [{ word: "def greet():", difficulty: "easy", category: "python" }];
const TEST_STATE = { score: 300, questions: TEST_QUESTIONS, currentQuestionIndex: 2, currentInput: "def", timeRemaining: 45 };

describe('loadProfile', () => {
    test('returns default profile when none exists', () => {
        const profile = loadProfile();
        expect(profile.name).toBe("");
        expect(profile.highScores).toEqual([0, 0, 0, 0, 0]);
    });

    test('correctly loads saved profile data', () => {
        saveProfile(TEST_PROFILE);
        const profile = loadProfile();
        expect(profile.name).toBe("Ben");
        expect(profile.highScores).toEqual([100, 200, 300, 400, 500]);
    });
});

describe('saveProfile', () => {
    test('returns true when profile is saved successfully', () => {
        expect(saveProfile(TEST_PROFILE)).toBe(true);
    });

    test('correctly saves profile data', () => {
        saveProfile(TEST_PROFILE);
        const profile = loadProfile();
        expect(profile.name).toBe("Ben");
        expect(profile.highScores).toEqual([100, 200, 300, 400, 500]);
    });

    test('returns false when localStorage is full', () => {
        jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
        });
        expect(saveProfile(TEST_PROFILE)).toBe(false);
    });
});

describe('clearProfile', () => {
    test('removes profile from localStorage', () => {
        saveProfile(TEST_PROFILE);
        clearProfile();
        expect(loadProfile().name).toBe("");
        expect(loadProfile().highScores).toEqual([0, 0, 0, 0, 0]);
    });

    test('does not affect game state', () => {
        saveState(TEST_STATE);
        clearProfile();
        expect(loadState().score).toBe(300);
    });
});

describe('loadState', () => {
    test('returns default state when none exists', () => {
        const state = loadState();
        expect(state.score).toBe(0);
        expect(state.currentQuestionIndex).toBe(0);
        expect(state.currentInput).toBe("");
        expect(state.timeRemaining).toBe(60);
    });

    test('correctly loads saved state data', () => {
        saveState(TEST_STATE);
        const state = loadState();
        expect(state.score).toBe(300);
        expect(state.currentQuestionIndex).toBe(2);
        expect(state.timeRemaining).toBe(45);
    });

    test('persists questions array', () => {
        saveState(TEST_STATE);
        expect(loadState().questions).toEqual(TEST_QUESTIONS);
    });
});

describe('saveState', () => {
    test('returns true when state is saved successfully', () => {
        expect(saveState(TEST_STATE)).toBe(true);
    });

    test('correctly saves score, index, and timeRemaining', () => {
        saveState(TEST_STATE);
        const state = loadState();
        expect(state.score).toBe(300);
        expect(state.currentQuestionIndex).toBe(2);
        expect(state.timeRemaining).toBe(45);
    });

    test('resets currentInput to empty string on save', () => {
        saveState(TEST_STATE);
        expect(loadState().currentInput).toBe("");
    });

    test('returns false when localStorage is full', () => {
        jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
        });
        expect(saveState(TEST_STATE)).toBe(false);
    });
});

describe('clearState', () => {
    test('removes state from localStorage', () => {
        saveState(TEST_STATE);
        clearState();
        expect(loadState().score).toBe(0);
    });

    test('does not affect profile data', () => {
        saveProfile(TEST_PROFILE);
        clearState();
        expect(loadProfile().name).toBe("Ben");
    });
});

describe('clearAll', () => {
    test('removes both profile and state from localStorage', () => {
        saveProfile(TEST_PROFILE);
        saveState(TEST_STATE);
        clearAll();
        expect(loadProfile().name).toBe("");
        expect(loadState().score).toBe(0);
    });
});
