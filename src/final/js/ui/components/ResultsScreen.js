import { assertHTMLElement } from "../utils.js";

/**
 * The results screen shown at the end of a game round.
 *
 * Expects the following HTML structure:
 * <div class="results-screen">
 *   <h2 class="results-title">...</h2>
 *   <p class="results-language-label">Language: <span class="results-language"></span></p>
 *   <div class="results-stats">
 *     <div class="results-stat">
 *       <span class="results-stat-label">Score</span>
 *       <span class="results-stat-value results-score"></span>
 *     </div>
 *     ... (accuracy, cpm, questions)
 *   </div>
 *   <div class="results-actions">
 *     <button class="results-retry">Retry</button>
 *     <button class="results-main-menu">Main Menu</button>
 *   </div>
 * </div>
 */
export default class ResultsScreen {
    /** @type {() => void} */
    #retryCallback = () => {};
    /** @type {() => void} */
    #mainMenuCallback = () => {};

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;

        this.scoreEl = assertHTMLElement(element.querySelector('.results-score'));
        this.accuracyEl = assertHTMLElement(element.querySelector('.results-accuracy'));
        this.cpmEl = assertHTMLElement(element.querySelector('.results-cpm'));
        this.questionsEl = assertHTMLElement(element.querySelector('.results-questions'));
        this.languageEl = assertHTMLElement(element.querySelector('.results-language'));

        const retryBtn = assertHTMLElement(element.querySelector('.results-retry'));
        const mainMenuBtn = assertHTMLElement(element.querySelector('.results-main-menu'));

        retryBtn.addEventListener('click', () => this.#retryCallback());
        mainMenuBtn.addEventListener('click', () => this.#mainMenuCallback());
    }

    /**
     * Populates and shows the results screen.
     * @param {{ score: number, accuracy: string, cpm: number, questionsAnswered: number, totalQuestions: number, language: string }} stats
     */
    show(stats) {
        this.scoreEl.textContent = `${stats.score}`;
        this.accuracyEl.textContent = `${stats.accuracy}`;
        this.cpmEl.textContent = `${stats.cpm}`;
        this.questionsEl.textContent = `${stats.questionsAnswered} / ${stats.totalQuestions}`;
        this.languageEl.textContent = stats.language;
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    /** @param {() => void} callback */
    onRetry(callback) {
        this.#retryCallback = callback;
    }

    /** @param {() => void} callback */
    onMainMenu(callback) {
        this.#mainMenuCallback = callback;
    }
}
