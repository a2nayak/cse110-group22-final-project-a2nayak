// questions.js

/**
 * Questions class
 *
 * Loads questions from a JSON file and provides questions one by one.
 *
 * Expected JSON structure:
 *
 * [
 *   {
 *     "answer": "def",
 *     "explanation": "The 'def' keyword is used to define a function in Python.",
 *     "difficulty": 1,
 *     "baseScore": 10
 *   }
 * ]
 */
export class Questions {
    /**
     * Creates a Questions instance.
     *
     * @param {string} questionPath
     *        Path to the questions JSON file.
     */
    constructor(questionPath = "../data/questions.json") {
        this.questionPath = questionPath;
        this.questions = [];
        this.usedQuestions = new Set();
        this.currentIndex = 0;
        this.loaded = false;
    }

    /**
     * Loads questions from the JSON file.
     *
     * This function uses fetch(), so it works in browser environments.
     *
     * @returns {Promise<Array<Object>>}
     *          The loaded question array.
     */
    async loadQuestions() {
        const response = await fetch(this.questionPath);

        if (!response.ok) {
            throw new Error(`Failed to load questions from ${this.questionPath}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("questions.json must contain an array of questions.");
        }

        this.questions = data.map(q => new Question(q.answer, q.explanation, q.difficulty, q.baseScore));
        this.currentIndex = 0;
        this.loaded = true;

        return this.questions;
    }

    /**
     * Returns the next question.
     * TODO: Added use progression system to increase difficulty and select random questions from a certain range of difficulties.
     * If there are no more questions, this returns null.
     *
     * @returns {Object|null}
     *          The next question object, or null if finished.
     */
    getNextQuestion() {
        if (!this.loaded) {
            throw new Error("Questions have not been loaded yet. Call loadQuestions() first.");
        }

        if (this.currentIndex >= this.questions.length) {
            return null;
        }
        if (this.usedQuestions.has(this.currentIndex)) {
            throw new Error("Question index has already been used. This should not happen if getNextQuestion() is used correctly.");
        }
        const question = this.questions[this.currentIndex];
        this.currentIndex += 1;
        this.usedQuestions.add(this.currentIndex - 1);

        return question;
    }

    /**
     * Returns the current question without moving to the next one.
     *
     * @returns {Object|null}
     *          The current question object, or null if finished.
     */
    getCurrentQuestion() {
        if (!this.loaded) {
            throw new Error("Questions have not been loaded yet. Call loadQuestions() first.");
        }

        if (this.currentIndex >= this.questions.length) {
            return null;
        }

        return this.questions[this.currentIndex];
    }

    /**
     * Checks whether there is another question available.
     *
     * @returns {boolean}
     *          True if another question exists.
     */
    hasNextQuestion() {
        return this.loaded && this.currentIndex < this.questions.length;
    }

    /**
     * Resets the question pointer back to the first question.
     *
     * This does not reload the JSON file.
     *
     * @returns {void}
     */
    resetQuestions() {
        this.currentIndex = 0;
    }

    /**
     * Returns the total number of loaded questions.
     *
     * @returns {number}
     *          Number of loaded questions.
     */
    getQuestionCount() {
        return this.questions.length;
    }

    /**
     * Returns the number of questions already used.
     *
     * @returns {number}
     *          Current question index.
     */
    getCurrentIndex() {
        return this.currentIndex;
    }
}

class Question {
    constructor(answer, explanation, difficulty, baseScore) {
        this.answer = answer;
        this.explanation = explanation;
        this.difficulty = difficulty;
        this.baseScore = baseScore;
    }
    // Getter functions for each property
    getAnswer() {
        return this.answer;
    }
    getExplanation() {
        return this.explanation;
    }
    getDifficulty() {
        return this.difficulty;
    }
    getBaseScore() {
        return this.baseScore;
    }
}