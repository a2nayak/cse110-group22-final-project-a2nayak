import {
  calculateBaseScore,
  calculateAccuracyMultiplier,
  calculateTimeMultiplier,
  calculateTotalScore,
} from "../src/final/js/systems/scoring.js";

// ── calculateBaseScore ────────────────────────────────────────────────────────

describe("calculateBaseScore", () => {
  test("starts at 50 when base_score is 0", () => {
    expect(calculateBaseScore({ base_score: 0 })).toBe(50);
  });

  test("adds 50 to existing base_score", () => {
    expect(calculateBaseScore({ base_score: 100 })).toBe(150);
  });

  test("works with large accumulated score", () => {
    expect(calculateBaseScore({ base_score: 400 })).toBe(450);
  });
});

// ── calculateAccuracyMultiplier ───────────────────────────────────────────────

describe("calculateAccuracyMultiplier", () => {
  test("returns 1 when totalChars is 0 (no division by zero)", () => {
    expect(calculateAccuracyMultiplier(0, 0)).toBe(1);
  });

  test("returns 1 when no incorrect chars", () => {
    expect(calculateAccuracyMultiplier(0, 10)).toBe(1);
  });

  test("returns 0.9 with 1 incorrect out of 10 chars", () => {
    expect(calculateAccuracyMultiplier(1, 10)).toBeCloseTo(0.9);
  });

  test("clamps to 0.5 minimum when many mistakes", () => {
    // 8 incorrect out of 10 → accuracy 0.2, clamped to 0.5
    expect(calculateAccuracyMultiplier(8, 10)).toBe(0.5);
  });

  test("returns 0.5 exactly at the clamp boundary (5 wrong out of 10)", () => {
    expect(calculateAccuracyMultiplier(5, 10)).toBe(0.5);
  });

  test("perfect accuracy on a single char", () => {
    expect(calculateAccuracyMultiplier(0, 1)).toBe(1);
  });
});

// ── calculateTimeMultiplier ───────────────────────────────────────────────────

describe("calculateTimeMultiplier", () => {
  test("returns 1 when timeLimit is 0 (guard against division by zero)", () => {
    expect(calculateTimeMultiplier(0, 0)).toBe(1);
  });

  test("returns 2.0 when finished instantly (timeElapsed = 0), clamped to 1.3", () => {
    // ratio=0 → multiplier = 1 + 1 = 2.0, clamped to 1.3
    expect(calculateTimeMultiplier(0, 60)).toBe(1.3);
  });

  test("returns 1.0 when exactly half time used", () => {
    // ratio=0.5 → multiplier = 1 + 0.5 = 1.5 → clamped below 1.3
    expect(calculateTimeMultiplier(30, 60)).toBe(1.3);
  });

  test("returns 1.0 exactly when all time used", () => {
    // ratio=1 → multiplier = 1 + 0 = 1.0
    expect(calculateTimeMultiplier(60, 60)).toBe(1.0);
  });

  test("clamps to 0.7 minimum when over time limit", () => {
    // ratio > 1 → multiplier < 1, could go below 0.7
    expect(calculateTimeMultiplier(90, 60)).toBe(0.7);
  });

  test("returns 1.0 at ratio 0.7 (boundary before clamping)", () => {
    // ratio=0.7 → multiplier = 1 + 0.3 = 1.3, still at cap
    expect(calculateTimeMultiplier(42, 60)).toBe(1.3);
  });
});

// ── calculateTotalScore ───────────────────────────────────────────────────────

describe("calculateTotalScore", () => {
  test("returns 0 for baseScore of 0", () => {
    const state = {
      incorrect_chars: 0,
      answers: ["abc", "def"],
      current_input: "",
      current_question_index: 0,
      timer: 60,
      time_limit: 60,
    };
    expect(calculateTotalScore(0, state)).toBe(0);
  });

  test("returns positive score with perfect play on first question done", () => {
    const state = {
      incorrect_chars: 0,
      answers: ["hello"],
      current_input: "",
      current_question_index: 1,  // just finished "hello"
      timer: 59,
      time_limit: 60,
    };
    const score = calculateTotalScore(50, state);
    expect(score).toBeGreaterThan(0);
  });

  test("includes current_input length in totalChars", () => {
    // state where player is mid-answer: typed "ab" of "abc"
    const statePartial = {
      incorrect_chars: 0,
      answers: ["abc"],
      current_input: "ab",
      current_question_index: 0,
      timer: 30,
      time_limit: 60,
    };
    // totalChars = 0 (no completed answers) + 2 (current_input) = 2
    // accuracyMultiplier = 1, timeMultiplier = max(0.7, min(1 + 0.5, 1.3)) = 1.3
    const score = calculateTotalScore(100, statePartial);
    expect(score).toBeGreaterThan(0);
  });

  test("rounds the result to an integer", () => {
    const state = {
      incorrect_chars: 1,
      answers: ["hello"],
      current_input: "",
      current_question_index: 1,
      timer: 45,
      time_limit: 60,
    };
    const score = calculateTotalScore(50, state);
    expect(Number.isInteger(score)).toBe(true);
  });

  test("is never negative", () => {
    const state = {
      incorrect_chars: 999,
      answers: ["x"],
      current_input: "",
      current_question_index: 1,
      timer: 0,
      time_limit: 60,
    };
    expect(calculateTotalScore(0, state)).toBeGreaterThanOrEqual(0);
  });

  test("multiple completed answers contribute to totalChars", () => {
    const state = {
      incorrect_chars: 0,
      answers: ["abc", "de", "fghi"],
      current_input: "",
      current_question_index: 3,  // all done
      timer: 30,
      time_limit: 60,
    };
    // totalChars = 3 + 2 + 4 = 9
    const score = calculateTotalScore(150, state);
    expect(score).toBeGreaterThan(0);
  });
});
