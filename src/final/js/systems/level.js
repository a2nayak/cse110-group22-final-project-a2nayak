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

import { QuestionSelector } from "./question.js";

export const DIFFICULTIES = {
  VERY_EASY: "1",
  EASY: "2",
  MEDIUM: "3",
  HARD: "4",
  VERY_HARD: "5",
};

const LEVELS = [
  { levelNumber: 1, timeLimit: 60, questionCount: 9, difficulty: "1" },
  { levelNumber: 2, timeLimit: 60, questionCount: 9, difficulty: "2" },
  { levelNumber: 3, timeLimit: 60, questionCount: 9, difficulty: "3" },
  { levelNumber: 4, timeLimit: 60, questionCount: 9, difficulty: "4" },
  { levelNumber: 5, timeLimit: 60, questionCount: 9, difficulty: "5" },
];

/**
 * Loads a level and returns initialized level session state.
 */
export async function loadLevel(levelNumber, category) {
  const config = LEVELS[levelNumber - 1];

  const response = await fetch(`../data/${category}.json`);
  const allQuestions = await response.json();

  // filter ONLY level-specific questions
  const levelQuestions = allQuestions.filter(
    q => String(q.level) === config.difficulty
  );

  // initialize selector
  const selector = new QuestionSelector(levelQuestions);

  // pre-pick first question
  const firstQuestion = selector.getNextQuestion();

  return {
    levelNumber,
    levelConfig: config,

    selector,            //used to advance question in game.js
    currentQuestion: firstQuestion,

    currentInput: "",
    timeRemaining: config.timeLimit,
    score: 0,
  };
}

/**
 * Returns the total number of available levels.
 * @returns {number}
 */
export function getLevelCount() {
  return LEVELS.length;
}
