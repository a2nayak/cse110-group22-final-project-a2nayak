import {
  loadProfile,
  saveProfile,
  clearProfile,
  loadState,
  saveState,
  clearState,
  clearAll,
  saveAll,
} from "../src/final/js/systems/storage.js";

// ── localStorage mock ─────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key) => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
});

// ── Profile ───────────────────────────────────────────────────────────────────

describe("saveProfile / loadProfile", () => {
  test("saves and reloads a profile", () => {
    const profile = { username: "Alice", score: 200, level: 3, num_questions_answered: 10, language: "Python" };
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });

  test("loadProfile returns default profile when nothing is saved", () => {
    const profile = loadProfile();
    expect(profile.username).toBe("Guest");
    expect(profile.score).toBe(0);
    expect(profile.level).toBe(1);
  });

  test("saveProfile overwrites a previous save", () => {
    saveProfile({ username: "Alice", score: 100, level: 1, num_questions_answered: 5, language: "Python" });
    saveProfile({ username: "Bob",   score: 999, level: 5, num_questions_answered: 50, language: "JavaScript" });
    expect(loadProfile().username).toBe("Bob");
    expect(loadProfile().score).toBe(999);
  });

  test("saveProfile returns true on success", () => {
    expect(saveProfile({ username: "Test", score: 0, level: 1, num_questions_answered: 0, language: "Python" })).toBe(true);
  });
});

describe("clearProfile", () => {
  test("removes the saved profile", () => {
    saveProfile({ username: "Alice", score: 0, level: 1, num_questions_answered: 0, language: "Python" });
    clearProfile();
    expect(loadProfile().username).toBe("Guest"); // falls back to default
  });

  test("is safe to call when no profile is saved", () => {
    expect(() => clearProfile()).not.toThrow();
  });
});

// ── Game State ────────────────────────────────────────────────────────────────

describe("saveState / loadState", () => {
  const sampleState = {
    plants: [1, 0, 0],
    questions: ["Q1", "Q2"],
    answers: ["A1", "A2"],
    current_question_index: 1,
    current_input: "partial",
    incorrect_chars: 2,
    timer: 45,
    time_limit: 60,
    base_score: 50,
  };

  test("saves and reloads game state", () => {
    saveState(sampleState);
    const loaded = loadState();
    expect(loaded.plants).toEqual([1, 0, 0]);
    expect(loaded.current_question_index).toBe(1);
    expect(loaded.timer).toBe(45);
    expect(loaded.base_score).toBe(50);
  });

  test("resets current_input to empty string on save", () => {
    saveState(sampleState);
    expect(loadState().current_input).toBe("");
  });

  test("loadState returns default state when nothing is saved", () => {
    const state = loadState();
    expect(state.questions).toEqual([]);
    expect(state.answers).toEqual([]);
    expect(state.timer).toBe(0);
    expect(state.base_score).toBe(0);
  });

  test("saveState returns true on success", () => {
    expect(saveState(sampleState)).toBe(true);
  });

  test("does not mutate the original state object", () => {
    saveState(sampleState);
    expect(sampleState.current_input).toBe("partial"); // unchanged
  });
});

describe("clearState", () => {
  test("removes the saved game state", () => {
    saveState({ plants: [1,0,0], questions: [], answers: [], current_question_index: 0, current_input: "", incorrect_chars: 0, timer: 30, time_limit: 60, base_score: 0 });
    clearState();
    expect(loadState().timer).toBe(0); // falls back to default
  });

  test("is safe to call when no state is saved", () => {
    expect(() => clearState()).not.toThrow();
  });
});

// ── Nuclear options ───────────────────────────────────────────────────────────

describe("clearAll", () => {
  test("removes both profile and state", () => {
    saveProfile({ username: "Alice", score: 0, level: 1, num_questions_answered: 0, language: "Python" });
    saveState({ plants: [0,0,0], questions: [], answers: [], current_question_index: 0, current_input: "", incorrect_chars: 0, timer: 30, time_limit: 60, base_score: 0 });
    clearAll();
    expect(loadProfile().username).toBe("Guest");
    expect(loadState().timer).toBe(0);
  });
});

describe("saveAll", () => {
  test("saves both profile and state", () => {
    const profile = { username: "Eve", score: 50, level: 2, num_questions_answered: 5, language: "Python" };
    const state = { plants: [2,0,0], questions: ["Q"], answers: ["A"], current_question_index: 0, current_input: "", incorrect_chars: 0, timer: 20, time_limit: 60, base_score: 50 };
    saveAll(profile, state);
    expect(loadProfile().username).toBe("Eve");
    expect(loadState().timer).toBe(20);
  });

  test("returns true on success", () => {
    const profile = { username: "Test", score: 0, level: 1, num_questions_answered: 0, language: "Python" };
    const state = { plants: [0,0,0], questions: [], answers: [], current_question_index: 0, current_input: "", incorrect_chars: 0, timer: 0, time_limit: 60, base_score: 0 };
    expect(saveAll(profile, state)).toBe(true);
  });
});
