import { loadLevel, getLevelCount } from "../src/final/js/systems/level.js";

// Sample question pool used in all fetch mocks
const MOCK_QUESTIONS = [
  { prompt: "What is 1+1?", answer: "2",    difficulty: "very easy", category: "math" },
  { prompt: "What is 2+2?", answer: "4",    difficulty: "very easy", category: "math" },
  { prompt: "What is 3+3?", answer: "6",    difficulty: "very easy", category: "math" },
  { prompt: "Hard q 1",     answer: "ans1", difficulty: "hard",      category: "math" },
  { prompt: "Hard q 2",     answer: "ans2", difficulty: "hard",      category: "math" },
];

function mockFetch(questions) {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(questions),
  });
}

beforeEach(() => {
  mockFetch(MOCK_QUESTIONS);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── getLevelCount ─────────────────────────────────────────────────────────────

describe("getLevelCount", () => {
  test("returns 5", () => {
    expect(getLevelCount()).toBe(5);
  });
});

// ── loadLevel ─────────────────────────────────────────────────────────────────

describe("loadLevel", () => {
  test("returns an object with questions and answers arrays", async () => {
    const state = await loadLevel(1, "math");
    expect(Array.isArray(state.questions)).toBe(true);
    expect(Array.isArray(state.answers)).toBe(true);
  });

  test("filters questions by the correct difficulty for level 1 (very easy)", async () => {
    const state = await loadLevel(1, "math");
    // Level 1 = "very easy", pool has 3 matching questions
    expect(state.questions.length).toBe(3);
  });

  test("filters questions by the correct difficulty for level 4 (hard)", async () => {
    const state = await loadLevel(4, "math");
    expect(state.questions.length).toBe(2);
  });

  test("questions and answers arrays have the same length", async () => {
    const state = await loadLevel(1, "math");
    expect(state.questions.length).toBe(state.answers.length);
  });

  test("returns state with timer equal to time_limit", async () => {
    const state = await loadLevel(1, "math");
    expect(state.timer).toBe(state.time_limit);
  });

  test("returns state with time_limit of 60 for level 1", async () => {
    const state = await loadLevel(1, "math");
    expect(state.time_limit).toBe(60);
  });

  test("returns plants as [0, 0, 0]", async () => {
    const state = await loadLevel(1, "math");
    expect(state.plants).toEqual([0, 0, 0]);
  });

  test("returns current_question_index of 0", async () => {
    const state = await loadLevel(1, "math");
    expect(state.current_question_index).toBe(0);
  });

  test("returns empty current_input string", async () => {
    const state = await loadLevel(1, "math");
    expect(state.current_input).toBe("");
  });

  test("returns incorrect_chars of 0", async () => {
    const state = await loadLevel(1, "math");
    expect(state.incorrect_chars).toBe(0);
  });

  test("returns base_score of 0", async () => {
    const state = await loadLevel(1, "math");
    expect(state.base_score).toBe(0);
  });

  test("fetches from the correct category URL", async () => {
    await loadLevel(2, "python");
    expect(global.fetch).toHaveBeenCalledWith("../data/python.json");
  });

  test("questions array contains prompt strings, not objects", async () => {
    const state = await loadLevel(1, "math");
    state.questions.forEach((q) => expect(typeof q).toBe("string"));
  });

  test("answers array contains answer strings, not objects", async () => {
    const state = await loadLevel(1, "math");
    state.answers.forEach((a) => expect(typeof a).toBe("string"));
  });

  test("question and answer at the same index are paired correctly", async () => {
    // Use a deterministic pool so we can verify pairing
    const pool = [
      { prompt: "P1", answer: "A1", difficulty: "easy", category: "test" },
      { prompt: "P2", answer: "A2", difficulty: "easy", category: "test" },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(pool),
    });

    const state = await loadLevel(2, "test"); // level 2 = "easy"
    for (let i = 0; i < state.questions.length; i++) {
      // Find original pair and confirm prompt/answer still match
      const original = pool.find((q) => q.prompt === state.questions[i]);
      expect(state.answers[i]).toBe(original.answer);
    }
  });

  test("returns empty questions array when no questions match difficulty", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    const state = await loadLevel(3, "empty");
    expect(state.questions.length).toBe(0);
    expect(state.answers.length).toBe(0);
  });
});
