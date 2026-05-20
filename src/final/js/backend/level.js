/**
 * level.js
 *
 * Defines hardcoded level configurations and handles level initialization.
 * Fetches and filters questions from the appropriate category JSON file.
 * Sets initial state parameters and loads the question set for the level.
 *
 * Imported by:
 * - game.js: calls loadLevel() at the start of each level
 */
/** @typedef {import('./models.js').Profile} Profile */
/** @typedef {import('./models.js').GameState} GameState */
const LEVELS = [
  { levelNumber: 1, timeLimit: 60, questionCount: 10, difficulty: "very easy" },
  { levelNumber: 2, timeLimit: 60, questionCount: 10, difficulty: "easy"      },
  { levelNumber: 3, timeLimit: 60, questionCount: 10, difficulty: "medium"    },
  { levelNumber: 4, timeLimit: 60, questionCount: 10, difficulty: "hard"      },
  { levelNumber: 5, timeLimit: 60, questionCount: 10, difficulty: "very hard" },
];

/**
 * Initializes state for the given level and category.
 * Fetches questions from the category JSON, filters by difficulty, and shuffles.
 * @param {GameState} state - The active game state object
 * @param {number} levelNumber - The level to load (1-indexed)
 * @param {string} category - Question category selected by the player (e.g. "python", "unix")
 */
export async function loadLevel(state, levelNumber, category) {
  const config = LEVELS[levelNumber - 1];

  const response = await fetch(`../data/${category}.json`);
  const allQuestions = await response.json();

  // Logic may change as question set develops. Question set is trash right now.
  // For now, samples all questions from difficulty corresponding to level. (Ex. level 4 -> 10 "hard" questions)
  state.questions = allQuestions
    .filter(/** @param {*} q */ q => q.difficulty === config.difficulty)
    .sort(() => Math.random() - 0.5)
    .slice(0, config.questionCount);

  state.currentQuestionIndex = 0;
  state.currentInput = "";
  state.timeRemaining = config.timeLimit;
}

/**
 * Returns the total number of available levels.
 * @returns {number}
 */
export function getLevelCount() {
  return LEVELS.length;
}
