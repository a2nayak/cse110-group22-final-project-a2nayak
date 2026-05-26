import { assertHTMLElement } from "../../utils.js";
/**
 * The component responsible for displaying the combo count.
 * 
 * Expects the following minimal HTML structure:
 * <span class="combo"></span>
 */
export default class Combo {
    /** @type {number} The current combo count */
    #comboCount = 0;
    /** @type {number} The currently rendered combo count, used for the roll down animation */
    #renderedComboCount = 0;
    /** @type {Promise<void> | null} */
    #rollDownPromise = null;

    /**
     * Binds this Combo to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        this.countElement = assertHTMLElement(element.querySelector('span'));
    }

    /**
     * Reactive. Sets the rendered combo count and updates the display.
     * @param {number} newCount - The new combo count to render.
     * @private
     */
    set renderedComboCount(newCount) {
        this.#renderedComboCount = newCount;
        this.countElement.textContent = this.#renderedComboCount.toString();
    }

    /**
     * Returns the currently rendered combo count.
     * @returns {number} The currently rendered combo count.
     * @private
     */
    get renderedComboCount() {
        return this.#renderedComboCount;
    }
    
    /**
     * Briefly flashes the combo text to indicate a change in combo count.
     * @private
     */
    flash(){
        this.element.setAttribute('data-flash-text', (this.#renderedComboCount + 1).toString() + 'x');
        this.element.classList.remove('flashed');
        this.element.offsetWidth; //force reflow to restart animation if already flashed
        this.element.classList.add('flashed');
    }

    /**
     * Increments the combo count by 1 and updates the display.
     */
    increment(){
        if(!this.#rollDownPromise) this.renderedComboCount = this.#comboCount;
        this.#comboCount++;
        setTimeout(() => this.renderedComboCount = this.#comboCount, 20);
        this.flash();
    }

    /**
     * Repeatedly decrements the rendered combo count by 1 every 0.01 seconds until it reaches 0.
     * @private
     */
    async rollDown(){
        if(this.#rollDownPromise) return; //prevent multiple simultaneous roll downs
        this.#rollDownPromise = new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if(this.renderedComboCount > this.#comboCount){
                    this.renderedComboCount--;
                } else {
                    clearInterval(intervalId);
                    this.#rollDownPromise = null;
                    resolve();
                }
            }, 20);
        });
    }

    /**
     * Resets the combo count to 0 and updates the display.
     */
    reset(){
        this.#comboCount = 0;
        this.rollDown();
    }
}
