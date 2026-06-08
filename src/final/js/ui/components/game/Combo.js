import { assertHTMLElement } from "../../utils.js";
import { store } from "../../store.js";
/**
 * @module Combo
 */
/*
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
        store.subscribe('combo', (/** @type {number} */ value) => this.setValue(value));
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
     * Sets the combo count and updates the display.
     * @param {number} newCombo - The new combo count.
     */
    setValue(newCombo) {
        if(newCombo > this.#comboCount){
            if(!this.#rollDownPromise) this.renderedComboCount = this.#comboCount;
            this.#comboCount = newCombo;
            setTimeout(() => this.renderedComboCount = this.#comboCount, 20);
            this.flash();
        } else {
            this.#comboCount = newCombo;
            this.rollDown();
        }
    }

    /**
     * Hard resets the combo count to 0 without the roll down animation. Used when starting a new level.
     */ 
    hardReset() {
        this.#comboCount = 0;
        this.element.classList.remove('flashed');
        this.renderedComboCount = 0;
    }

    /**
     * Returns the current combo count held by this component.
     */
    get combo() {
        return this.#comboCount;
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
     * Repeatedly decrements the rendered combo count by 1 until it reaches 0.
     * @private
     */
    rollDown(){
        if(this.#rollDownPromise) return this.#rollDownPromise; //prevent multiple simultaneous roll downs
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
        return this.#rollDownPromise;
    }

    /**
     * Resets the combo count to 0 and updates the display.
     * @return {Promise<void>} A promise that resolves when the roll down animation is complete.
     */
    reset(){
        this.#comboCount = 0;
        return this.rollDown();
    }
}
