/**
 * game.test.js
 *
 * Tests for game.js using jest.mock() to isolate all dependencies.
 * Because game.js holds module-level state (let state, let player) we
 * re-import the module fresh for each describe block via jest.resetModules().
 */

// ── Dependency mocks ──────────────────────────────────────────────────────────

jest.mock("../src/final/js/systems/level.js", () => ({
  loadLevel: jest.fn(),
}));

jest.mock("../src/final/js/systems/timer.js", () => ({
  startTimer: jest.fn(),
  stopTimer:  jest.fn(),
}));

jest.mock("../src/final/js/systems/scoring.js", () => ({
  calculateBaseScore:  jest.fn(() => 50),
  calculateTotalScore: jest.fn(() => 100),
}));

jest.mock("../src/final/js/systems/storage.js", () => ({
  saveProfile: jest.fn(),
  saveState:   jest.fn(),
  clearState:  jest.fn(),
}));

jest.mock("../src/final/js/systems/plants.js", () => ({
  growNextPlant: jest.fn(() => [1, 0, 0]),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLevelState(overrides = {}) {
  return {
    plants:                 [0, 0, 0],
    questions:              ["Q1", "Q2", "Q3"],
    answers:                ["A1", "A2", "A3"],
    current_question_index: 0,
    current_input:          "",
    incorrect_chars:        0,
    timer:                  60,
    time_limit:             60,
    base_score:             0,
    ...overrides,
  };
}

// ── Import game module (once, at the top level) ───────────────────────────────

import {
  registerCallbacks,
  startLevel,
  endGame,
  pauseGame,
  resumeGame,
  goToLevelSelect,
  goToMainMenu,
  onInput,
} from "../src/final/js/systems/game.js";

import { loadLevel } from "../src/final/js/systems/level.js";
import { startTimer, stopTimer } from "../src/final/js/systems/timer.js";
import { calculateBaseScore, calculateTotalScore } from "../src/final/js/systems/scoring.js";
import { saveProfile, clearState } from "../src/final/js/systems/storage.js";
import { growNextPlant } from "../src/final/js/systems/plants.js";

// Shared callback spies
let mockLoadScreen;
let mockUpdateScreen;

beforeEach(() => {
  jest.clearAllMocks();

  mockLoadScreen  = jest.fn();
  mockUpdateScreen = jest.fn();
  registerCallbacks(mockLoadScreen, mockUpdateScreen);

  // Default: loadLevel returns a fresh level state
  loadLevel.mockResolvedValue(makeLevelState());
});

// ── registerCallbacks ─────────────────────────────────────────────────────────

describe("registerCallbacks", () => {
  test("does not throw when called with two functions", () => {
    expect(() => registerCallbacks(() => {}, () => {})).not.toThrow();
  });
});

// ── startLevel ────────────────────────────────────────────────────────────────

describe("startLevel", () => {
  test("calls loadLevel with the given levelNumber and category", async () => {
    await startLevel(2, "python");
    expect(loadLevel).toHaveBeenCalledWith(2, "python");
  });

  test("starts the timer after loading the level", async () => {
    await startLevel(1, "python");
    expect(startTimer).toHaveBeenCalledTimes(1);
  });

  test("loads the game screen after starting the level", async () => {
    await startLevel(1, "python");
    expect(mockLoadScreen).toHaveBeenCalledWith("game", expect.any(Object));
  });
});

// ── endGame ───────────────────────────────────────────────────────────────────

describe("endGame", () => {
  test("stops the timer", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    endGame();
    expect(stopTimer).toHaveBeenCalled();
  });

  test("saves the player profile", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    endGame();
    expect(saveProfile).toHaveBeenCalledTimes(1);
  });

  test("clears in-progress state from storage", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    endGame();
    expect(clearState).toHaveBeenCalledTimes(1);
  });

  test("loads the endscreen", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    endGame();
    expect(mockLoadScreen).toHaveBeenCalledWith("endscreen", expect.any(Object));
  });

  test("accumulates score into player profile", async () => {
    calculateTotalScore.mockReturnValue(200);
    await startLevel(1, "python");
    endGame();
    const savedProfile = saveProfile.mock.calls[0][0];
    expect(savedProfile.score).toBeGreaterThanOrEqual(200);
  });
});

// ── pauseGame ─────────────────────────────────────────────────────────────────

describe("pauseGame", () => {
  test("stops the timer", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    pauseGame();
    expect(stopTimer).toHaveBeenCalled();
  });

  test("loads the pause screen", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    pauseGame();
    expect(mockLoadScreen).toHaveBeenCalledWith("pause", expect.any(Object));
  });
});

// ── resumeGame ────────────────────────────────────────────────────────────────

describe("resumeGame", () => {
  test("restarts the timer when timer > 0", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    resumeGame();
    expect(startTimer).toHaveBeenCalledTimes(1);
  });

  test("loads the game screen when timer > 0", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    resumeGame();
    expect(mockLoadScreen).toHaveBeenCalledWith("game", expect.any(Object));
  });

  test("does nothing when timer is 0", async () => {
    loadLevel.mockResolvedValue(makeLevelState({ timer: 0 }));
    await startLevel(1, "python");
    jest.clearAllMocks();
    resumeGame();
    expect(startTimer).not.toHaveBeenCalled();
    expect(mockLoadScreen).not.toHaveBeenCalled();
  });
});

// ── goToLevelSelect ───────────────────────────────────────────────────────────

describe("goToLevelSelect", () => {
  test("stops the timer", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    goToLevelSelect();
    expect(stopTimer).toHaveBeenCalled();
  });

  test("loads the levelselect screen", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    goToLevelSelect();
    expect(mockLoadScreen).toHaveBeenCalledWith("levelselect", expect.any(Object));
  });
});

// ── goToMainMenu ──────────────────────────────────────────────────────────────

describe("goToMainMenu", () => {
  test("stops the timer", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    goToMainMenu();
    expect(stopTimer).toHaveBeenCalled();
  });

  test("loads the mainmenu screen", async () => {
    await startLevel(1, "python");
    jest.clearAllMocks();
    goToMainMenu();
    expect(mockLoadScreen).toHaveBeenCalledWith("mainmenu", expect.any(Object));
  });
});

// ── onInput ───────────────────────────────────────────────────────────────────

describe("onInput", () => {
  beforeEach(async () => {
    loadLevel.mockResolvedValue(makeLevelState({
      questions: ["Q1", "Q2"],
      answers:   ["ab",  "cd"],
    }));
    await startLevel(1, "python");
    jest.clearAllMocks();
  });

  test("fires 'incorrect' when wrong character typed", () => {
    onInput("z");
    expect(mockUpdateScreen).toHaveBeenCalledWith("incorrect", expect.any(Object));
  });

  test("fires 'correct-char' when correct character typed but answer not complete", () => {
    onInput("a"); // first char of "ab"
    expect(mockUpdateScreen).toHaveBeenCalledWith("correct-char", expect.any(Object));
  });

  test("fires 'next-question' when answer is completed and questions remain", () => {
    onInput("a"); // first char of "ab"
    onInput("b"); // completes "ab" → advances to next question
    expect(mockUpdateScreen).toHaveBeenCalledWith("next-question", expect.any(Object));
  });

  test("calls endGame (via loadScreen 'endscreen') when last answer is completed", () => {
    // Complete first answer "ab"
    onInput("a");
    onInput("b");
    jest.clearAllMocks();
    // Complete second answer "cd"
    onInput("c");
    onInput("d");
    expect(mockLoadScreen).toHaveBeenCalledWith("endscreen", expect.any(Object));
  });

  test("calls calculateBaseScore when an answer is completed", () => {
    onInput("a");
    onInput("b");
    expect(calculateBaseScore).toHaveBeenCalled();
  });

  test("calls growNextPlant when an answer is completed", () => {
    onInput("a");
    onInput("b");
    expect(growNextPlant).toHaveBeenCalled();
  });

  test("returns early when there is no active question", () => {
    // Force question index out of range by completing all questions
    onInput("a"); onInput("b"); // Q1 done
    jest.clearAllMocks();
    onInput("c"); onInput("d"); // Q2 done → endGame
    jest.clearAllMocks();
    // Now no active question — should return early silently
    onInput("x");
    expect(mockUpdateScreen).not.toHaveBeenCalled();
  });

  test("state data passed to updateScreen contains current state shape", () => {
    onInput("z"); // incorrect
    const data = mockUpdateScreen.mock.calls[0][1];
    expect(data).toHaveProperty("questions");
    expect(data).toHaveProperty("answers");
    expect(data).toHaveProperty("timer");
    expect(data).toHaveProperty("base_score");
  });
});
