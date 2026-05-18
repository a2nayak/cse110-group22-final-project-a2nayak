// scoring.test.js
import { ScoringSystem } from "../src/prototype/js/scoring.js";
import { TimerType } from "../src/prototype/js/timer.js";

// Mock Question object
function makeQuestion(baseScore, answer, difficulty) {
    return {
        getBaseScore: () => baseScore,
        getAnswer: () => answer,
        getDifficulty: () => difficulty,
    };
}

// Mock timer result object
function makeTimerResult(totalTimeUsed, timerType = TimerType.stopwatch, timeLimit = 0) {
    return {
        timer_type: timerType,
        ticks_per_second: 10,
        total_time_used: totalTimeUsed,
        time_limit: timeLimit,
        timer_ended: true,
    };
}

// ─── ScoringSystem ────────────────────────────────────────────────────────────

describe("ScoringSystem", () => {

    let scoring;

    beforeEach(() => {
        scoring = new ScoringSystem();
    });

    // ── getScore ──────────────────────────────────────────────────────────────

    describe("getScore()", () => {
        test("starts at 0", () => {
            expect(scoring.getScore()).toBe(0);
        });
    });

    // ── resetScore ────────────────────────────────────────────────────────────

    describe("resetScore()", () => {
        test("resets score to 0", () => {
            scoring.resetScore(); // even without prior score, should stay 0
            expect(scoring.getScore()).toBe(0);
        });

        test("calls callback with 0 after reset", () => {
            const cb = jest.fn();
            scoring.init(cb);
            scoring.resetScore();
            expect(cb).toHaveBeenCalledWith(0);
        });
    });

    // ── normalizeWhitespace ───────────────────────────────────────────────────

    describe("normalizeWhitespace()", () => {
        test("trims leading and trailing spaces", () => {
            expect(scoring.normalizeWhitespace("  hello  ")).toBe("hello");
        });

        test("collapses internal multiple spaces into one", () => {
            expect(scoring.normalizeWhitespace("def   foo()")).toBe("def foo()");
        });

        test("handles tabs and newlines", () => {
            expect(scoring.normalizeWhitespace("def\t\nfoo()")).toBe("def foo()");
        });

        test("returns empty string unchanged", () => {
            expect(scoring.normalizeWhitespace("")).toBe("");
        });
    });

    // ── checkSyntaxMatch ──────────────────────────────────────────────────────

    describe("checkSyntaxMatch()", () => {
        test("returns true for identical strings", () => {
            expect(scoring.checkSyntaxMatch("def foo()", "def foo()")).toBe(true);
        });

        test("returns true when whitespace differs", () => {
            expect(scoring.checkSyntaxMatch("def  foo()", "def foo()")).toBe(true);
        });

        test("returns false for different answers", () => {
            expect(scoring.checkSyntaxMatch("def foo()", "def bar()")).toBe(false);
        });

        test("returns false for completely wrong answer", () => {
            expect(scoring.checkSyntaxMatch("print()", "def foo()")).toBe(false);
        });
    });

    // ── calculateTypingAccuracy ───────────────────────────────────────────────

    describe("calculateTypingAccuracy()", () => {
        test("returns 1 when both strings are empty", () => {
            expect(scoring.calculateTypingAccuracy("", "")).toBe(1);
        });

        test("returns 0 when user answer is empty", () => {
            expect(scoring.calculateTypingAccuracy("", "def")).toBe(0);
        });

        test("returns 0 when correct answer is empty but user typed something", () => {
            expect(scoring.calculateTypingAccuracy("def", "")).toBe(0);
        });

        test("returns 1 for a perfect match", () => {
            expect(scoring.calculateTypingAccuracy("def foo()", "def foo()")).toBe(1);
        });

        test("returns partial accuracy for partially correct answer", () => {
            // "def" vs "abc": 0 matching chars, maxLength=3 → 0
            expect(scoring.calculateTypingAccuracy("def", "abc")).toBe(0);
        });

        test("penalizes extra characters (user typed more than correct)", () => {
            // "defXXX" vs "def": 3 correct out of max 6
            const acc = scoring.calculateTypingAccuracy("defXXX", "def");
            expect(acc).toBeCloseTo(3 / 6);
        });

        test("penalizes missing characters (user typed less than correct)", () => {
            // "de" vs "def": 2 correct out of max 3
            const acc = scoring.calculateTypingAccuracy("de", "def");
            expect(acc).toBeCloseTo(2 / 3);
        });

        test("returns value between 0 and 1", () => {
            const acc = scoring.calculateTypingAccuracy("hello", "world");
            expect(acc).toBeGreaterThanOrEqual(0);
            expect(acc).toBeLessThanOrEqual(1);
        });
    });

    // ── updateScore ───────────────────────────────────────────────────────────
    // NOTE: There is a bug in the current code — `self.addScore(finalScore)` should
    // be `this.#addScore(finalScore)`. These tests will fail until that is fixed.

    describe("updateScore()", () => {
        test("returns a number", () => {
            const q = makeQuestion(100, "def foo():", 1);
            const timer = makeTimerResult(5);
            const result = scoring.updateScore(q, "def foo():", timer);
            expect(typeof result).toBe("number");
        });

        test("returns correct score for perfect answer with no time elapsed", () => {
            // Formula: BC + BC*(1 + accuracy) - secondsElapsed * difficulty
            // accuracy=1, secondsElapsed=0, difficulty=1, BC=100
            // = 100 + 100*(1+1) - 0*1 = 300
            const q = makeQuestion(100, "def foo():", 1);
            const timer = makeTimerResult(0);
            const result = scoring.updateScore(q, "def foo():", timer);
            expect(result).toBeCloseTo(300);
        });

        test("penalizes time elapsed", () => {
            // accuracy=1, secondsElapsed=10, difficulty=1, BC=100
            // = 100 + 100*(2) - 10*1 = 290
            const q = makeQuestion(100, "def foo():", 1);
            const timer = makeTimerResult(10);
            const result = scoring.updateScore(q, "def foo():", timer);
            expect(result).toBeCloseTo(290);
        });

        test("penalizes higher difficulty more", () => {
            // accuracy=1, secondsElapsed=10, difficulty=5, BC=100
            // = 100 + 200 - 50 = 250
            const q = makeQuestion(100, "def foo():", 5);
            const timer = makeTimerResult(10);
            const result = scoring.updateScore(q, "def foo():", timer);
            expect(result).toBeCloseTo(250);
        });

        test("score is lower for inaccurate answer", () => {
            const q = makeQuestion(100, "def foo():", 1);
            const timer = makeTimerResult(0);
            const perfectScore = scoring.updateScore(q, "def foo():", timer);

            const scoring2 = new ScoringSystem();
            const timer2 = makeTimerResult(0);
            const badScore = scoring2.updateScore(q, "xxxxxxxxx", timer2);

            expect(badScore).toBeLessThan(perfectScore);
        });

        test("callback is called after updateScore", () => {
            const cb = jest.fn();
            scoring.init(cb);
            const q = makeQuestion(100, "def foo():", 1);
            const timer = makeTimerResult(0);
            scoring.updateScore(q, "def foo():", timer);
            expect(cb).toHaveBeenCalled();
        });
    });
});
