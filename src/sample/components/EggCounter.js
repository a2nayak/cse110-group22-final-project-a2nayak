import { assertHTMLElement } from "../utils.js";

/**
 * The main component for the app.
 * 
 * Expects the following minimal HTML structure:
 * <div class="egg-counter">
 *   <span class="egg-counter-text"></span>
 *   <button class="egg-counter-increment"></button>
 *   <button class="egg-counter-decrement"></button>
 * </div>
 */
export default class EggCounter {
    /** @type {number} */ #count = 0;
    /** @type {HTMLElement} */ element;
    /** @private @type {HTMLElement} */ incrementButton;
    /** @private @type {HTMLElement} */ decrementButton;

    /**
     * Binds this EggCounter to the given element.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.incrementButton = assertHTMLElement(this.element.querySelector('.egg-counter-increment'));
        this.decrementButton = assertHTMLElement(this.element.querySelector('.egg-counter-decrement'));
        this.counterText = assertHTMLElement(this.element.querySelector('.egg-counter-text'));
        
        this.count = 0;
    }

    /**
     * Registers a callback to be invoked when the egg count changes.
     * @param {(newCount: number) => void} callback
     */
    onUpdateCount(callback) {
        this.incrementButton.addEventListener('click', () => callback(this.count + 1));
        this.decrementButton.addEventListener('click', () => callback(this.count - 1));
    }

    /**
     * Gets the current egg count.
     * @returns {number}
     */
    get count() {
        return this.#count;
    }

    /**
     * Sets the current egg count and updates the display.
     * @param {number} newCount
     */
    set count(newCount) {
        this.#count = newCount;
        this.counterText.textContent = `Eggs: ${this.#count}`;
    }
}