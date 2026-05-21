//goal is to load questions and retrieve them one by one without repeats until the pool is exhausted, then reset for next level
//imported by level.js, which calls loadLevel() to fetch questions for the level and getNextQuestion() to retrieve them one by one during the level

/**
 * QuestionSelector
 *
 * Handles question selection within a level.
 * Ensures no repeated questions until pool is exhausted.
 */
export class QuestionSelector {
  constructor(questions) {
    this.allQuestions = questions;
    this.remaining = [...questions];
    this.used = [];
  }

  /**
   * Returns a random unused question
   */
  getNextQuestion() {
    if (this.remaining.length === 0) {
      return null; // or reshuffle depending on design choice
    }

    const index = Math.floor(Math.random() * this.remaining.length);
    const question = this.remaining[index];

    // remove from remaining
    this.remaining.splice(index, 1);
    this.used.push(question);

    return question;
  }

  /**
   * Resets question pool (use when restarting level)
   */
  reset() {
    this.remaining = [...this.allQuestions];
    this.used = [];
  }
}