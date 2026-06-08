import { assertHTMLElement } from "../utils.js";
import { store } from "../store.js";

/**
 * @module ResultsScreen
 */
/*
 * The results screen shown at the end of a game round.
 *
 * Expects the following HTML structure:
 * <div class="results-screen">
 *   <h2 class="results-title">...</h2>
 *   <div class="results-stats">
 *     <div class="results-stat">
 *       <span class="results-label">Score</span>
 *       <span class="results-stat-value results-score"></span>
 *     </div>
 *     ... (accuracy, cpm, questions)
 *   </div>
 *   <div class="results-actions">
 *     <button class="results-retry">Retry</button>
 *     <button class="results-main-menu">Main Menu</button>
 *   </div>
 *   <p class="results-label results-language-label">Language: <span class="results-language"></span></p>
 * </div>
 */
export default class ResultsScreen {
    /**
     * Binds this ResultsScreen to the given element.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;

        this.scoreEl = assertHTMLElement(element.querySelector('.results-score'));
        this.accuracyEl = assertHTMLElement(element.querySelector('.results-accuracy'));
        this.cpmEl = assertHTMLElement(element.querySelector('.results-cpm'));
        this.questionsEl = assertHTMLElement(element.querySelector('.results-questions'));
        this.languageEl = assertHTMLElement(element.querySelector('.results-language'));

        this.retryBtn = assertHTMLElement(element.querySelector('.results-retry'));
        this.mainMenuBtn = assertHTMLElement(element.querySelector('.results-main-menu'));
        this.nextBtn = assertHTMLElement(element.querySelector('.results-next'));

        //add event listener for enter navigation, if **nothing** is focused, focus retry button, otherwise, trigger click
        this.onEnter(() => {
            const activeElement = document.activeElement;
            console.error(activeElement);
            if (activeElement === document.body && !this.nextBtn.classList.contains('hidden')) {
                this.nextBtn.click();
            }
        });
    }

    /**
     * Populates and shows the results screen.
     * @param {{ score: number, accuracy: string, cpm: number, language: string }} stats
     */
    show(stats) {
        this.scoreEl.textContent = `${stats.score}`;
        const accuracyPercent = Math.floor(parseFloat(stats.accuracy) * 100);
        this.accuracyEl.textContent = `${accuracyPercent}%`;
        this.cpmEl.textContent = `${stats.cpm}`;
        this.questionsEl.textContent = `${stats.questionsAnswered} / ${stats.totalQuestions}`;
        const languageCapitalized = stats.language.charAt(0).toUpperCase() + stats.language.slice(1);
        this.languageEl.textContent = `\u00A0${languageCapitalized}`;
        if(store.retrieve('level') >= 3) {
            this.nextBtn.classList.add('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
        }
        this.element.classList.remove('hidden');
    }

    /**
     * Hides the results screen.
     */
    hide() {
        this.element.classList.add('hidden');
    }

    /**
     * Registers a callback to be called when the user clicks the Retry button.
     * @param {() => void} callback
     */
    onRetry(callback) {
        this.retryBtn.addEventListener('click', callback);
    }

    /**
     * Registers a callback to be called when the user clicks the Main Menu button.
     * @param {() => void} callback
     */
    onMainMenu(callback) {
        this.mainMenuBtn.addEventListener('click', callback);
    }

    /** 
     * Registers a callback to be called when the user clicks the Next Level button.
     * @param {() => void} callback
     */
    onNext(callback) {
        this.nextBtn.addEventListener('click', callback);
    }

    /**
     * Registers a callback to be called when the user presses the Enter key.
     * @param {() => void} callback
     */
    onEnter(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                console.error('Enter key pressed on results screen');
                callback();
            }
        });
    }
}
