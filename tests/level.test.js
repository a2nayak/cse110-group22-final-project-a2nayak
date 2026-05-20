/*
Test file for level.js
*/

import { loadLevel, getLevelCount } from '../src/final/js/backend/level.js';

const MOCK_QUESTIONS = [
  { word: "print('hello')", difficulty: "very easy", category: "python" },
  { word: "import math",    difficulty: "very easy", category: "python" },
  { word: "return True",    difficulty: "very easy", category: "python" },
  { word: "while True:",    difficulty: "very easy", category: "python" },
  { word: "x = [1, 2, 3]", difficulty: "very easy", category: "python" },
  { word: "len(my_list)",   difficulty: "very easy", category: "python" },
  { word: "if x > 0:",      difficulty: "very easy", category: "python" },
  { word: "x = 10",         difficulty: "very easy", category: "python" },
  { word: "def greet():",   difficulty: "very easy", category: "python" },
  { word: "for i in range(5):", difficulty: "very easy", category: "python" },
  { word: "def add(a, b):", difficulty: "easy", category: "python" },
  { word: "raise ValueError", difficulty: "easy", category: "python" },
];

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ json: () => Promise.resolve(MOCK_QUESTIONS) })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('getLevelCount', () => {
    test('returns the correct number of levels', () => {
        expect(getLevelCount()).toBe(5);
    });
});

describe('loadLevel', () => {
    test('sets currentQuestionIndex to 0', async () => {
        const state = {};
        await loadLevel(state, 1, 'python');
        expect(state.currentQuestionIndex).toBe(0);
    });

    test('resets currentInput to empty string', async () => {
        const state = { currentInput: "partial" };
        await loadLevel(state, 1, 'python');
        expect(state.currentInput).toBe("");
    });

    test('sets timeRemaining from level config', async () => {
        const state = {};
        await loadLevel(state, 1, 'python');
        expect(state.timeRemaining).toBe(60);
    });

    test('filters questions by difficulty', async () => {
        const state = {};
        await loadLevel(state, 1, 'python');
        expect(state.questions.every(q => q.difficulty === "very easy")).toBe(true);
    });

    test('limits questions to level questionCount', async () => {
        const state = {};
        await loadLevel(state, 1, 'python');
        expect(state.questions.length).toBeLessThanOrEqual(10);
    });

    test('fetches from correct category file', async () => {
        const state = {};
        await loadLevel(state, 1, 'python');
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('python.json'));
    });

    test('loads questions for each level without error', async () => {
        const state = {};
        for (let i = 1; i <= getLevelCount(); i++) {
            await expect(loadLevel(state, i, 'python')).resolves.not.toThrow();
        }
    });
});
