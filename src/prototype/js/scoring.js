// Scoring.js

import { TimerType } from "./timer.js";
import { Question } from "./questions.js";
/**
 * ScoringSystem class
 *
 * Handles:
 * - total game score
 * - current streak
 * - streak multiplier
 * - typing accuracy
 * - syntax matching
 * - time bonus
 * - score calculation
 */
export class ScoringSystem {
    constructor(callback = null) {
        this.totalGameScore = 0.0;
        this.callback = callback;

        //unused for now, but we can add back some of the old features later if we want to

        // this.streakMultiplier = 1;
        // this.currentStreak = 0;
        // this.MAX_TIME_BONUS = 500;
        // this.TIME_BONUS_MULTIPLIER = 5;

    }

    /**
     * Resets the scoring system.
     *
     * @param {Function|null} callback
     *        Optional callback function called when score changes.
     */
    init(callback = null) {
        this.totalGameScore = 0;
        this.callback = callback;

        // this.streakMultiplier = 1;
        // this.currentStreak = 0;
    }

    /**
     * Returns the current total game score.
     */
    getScore() {
        return this.totalGameScore;
    }

    /**
     * getStreak() and getStreakMultiplier() are currently DEPRECATED since we switched to a more question-based scoring system, but we can add back some of the old features later if we want to.
     */
    // /**
    //  * Returns the current correct-answer streak.
    //  */
    // getStreak() {
    //     return this.currentStreak;
    // }

    // /**
    //  * Returns the current streak multiplier.
    //  */
    // getStreakMultiplier() {
    //     return this.streakMultiplier;
    // }

    /**
     * Private method to add score and uses call callback function.
     * Adds score to the total game score.
     *
     * @param {number} score
     */
    #addScore(score) {
        this.totalGameScore += score;

        if (this.callback) {
            this.callback(this.totalGameScore);
        }
    }

    /**
     * Resets score, streak, and multiplier.
     */
    resetScore() {
        this.totalGameScore = 0;
        this.currentStreak = 0;
        this.streakMultiplier = 1;

        if (this.callback) {
            this.callback(this.totalGameScore);
        }
    }

    /**
     * Helper function but currently unused.
     * Normalizes whitespace.
     *
     * Example:
     * "def   foo()" becomes "def foo()"
     *
     * @param {string} str
     * @returns {string}
     */
    normalizeWhitespace(str) {
        return str.trim().replace(/\s+/g, " ");
    }

    /**
     * A simple syntax checker but currently unused.
     * Checks whether two answers match after whitespace normalization.
     *
     * This allows answers with different spacing to still count as syntax-correct.
     *
     * @param {string} userAnswer
     * @param {string} correctAnswer
     * @returns {boolean}
     */
    checkSyntaxMatch(userAnswer, correctAnswer) {
        return this.normalizeWhitespace(userAnswer) === this.normalizeWhitespace(correctAnswer);
    }

    /**
     * Calculates typing accuracy.
     *
     * This version punishes:
     * - wrong characters
     * - missing characters
     * - extra characters
     *
     * @param {string} userAnswer
     * @param {string} correctAnswer
     * @returns {number}
     *          Accuracy between 0 and 1.
     */
    calculateTypingAccuracy(userAnswer, correctAnswer) {
        if (userAnswer.length === 0 && correctAnswer.length === 0) {
            return 1;
        }

        if (userAnswer.length === 0 || correctAnswer.length === 0) {
            return 0;
        }

        let correctChars = 0;
        const compareLength = Math.min(userAnswer.length, correctAnswer.length);

        for (let i = 0; i < compareLength; i++) {
            if (userAnswer[i] === correctAnswer[i]) {
                correctChars++;
            }
        }

        const maxLength = Math.max(userAnswer.length, correctAnswer.length);

        return correctChars / maxLength;
    }

    /**
     * Helper function but currently unused.
     * Calculates time bonus from timer result.
     *
     * For countdown:
     * - more remaining time gives more bonus
     *
     * For stopwatch:
     * - less used time gives more bonus
     *
     * @param {Object} timerResults
     * @returns {number}
     */
    calculateTimeBonus(timerResults) {
        if (timerResults.timer_type === TimerType.countdown) {
            const timeLeft = Math.max(
                0,
                timerResults.time_limit - timerResults.total_time_used
            );

            return Math.min(
                timeLeft * this.TIME_BONUS_MULTIPLIER,
                this.MAX_TIME_BONUS
            );
        }

        return Math.max(
            0,
            this.MAX_TIME_BONUS - timerResults.total_time_used
        );
    }
    // DEPRECATED: compareAnswer() is no longer used since we switched to a more question-based scoring system. Keeping it here for reference in case we want to add back some of the old features later.
    //   /**
    //    * Compares user answer with correct answer and updates score.
    //    *
    //    * @param {string} userAnswer
    //    * @param {string} correctAnswer
    //    * @param {Object} timerResults
    //    * @param {number} baseScore
    //    *
    //    * @returns {Object}
    //    */
    //   compareAnswer(userAnswer, correctAnswer, timerResults, baseScore = 100) {
    //     const syntaxCorrect = this.checkSyntaxMatch(userAnswer, correctAnswer);
    //     const exactMatch = userAnswer === correctAnswer;
    //     const typingAccuracy = this.calculateTypingAccuracy(userAnswer, correctAnswer);

    //     if (syntaxCorrect) {
    //       this.currentStreak += 1;
    //       this.streakMultiplier = Math.min(2, 1 + this.currentStreak * 0.1);
    //     } else {
    //       this.currentStreak = 0;
    //       this.streakMultiplier = 1;
    //     }

    //     let earnedScore = 0;

    //     if (syntaxCorrect) {
    //       const timeBonus = this.calculateTimeBonus(timerResults);

    //       earnedScore = Math.round(
    //         (baseScore + timeBonus) * typingAccuracy * this.streakMultiplier
    //       );

    //       this.addScore(earnedScore);
    //     }

    //     return {
    //       syntax_correct: syntaxCorrect,
    //       exact_match: exactMatch,
    //       typing_accuracy: typingAccuracy,
    //       current_streak: this.currentStreak,
    //       streak_multiplier: this.streakMultiplier,
    //       earned_score: earnedScore,
    //       total_game_score: this.totalGameScore,
    //     };
    //   }

    /**
     * Calculates score using question object.
     *
     * Expected question object methods:
     * - getBaseScore()
     * - getAnswer()
     * - getDifficulty()
     *
     * Formula:
     * base_score + base_score * (1 + accuracy) - seconds_elapsed * difficulty
     *
     * @param {Object} question
     * @param {string} userAnswer
     * @param {Object} timerResults
     *
     * @returns {number}
     */
    updateScore(question, userAnswer, timerResults) {
        const baseScore = question.getBaseScore();
        const correctAnswer = question.getAnswer();
        const difficulty = question.getDifficulty();

        const secondsElapsed = timerResults.total_time_used;
        const accuracy = this.calculateTypingAccuracy(userAnswer, correctAnswer);

        const finalScore = (
            baseScore +
            baseScore * (1 + accuracy) -
            secondsElapsed * difficulty
        );
        self.addScore(finalScore);
        return finalScore;
    }
}