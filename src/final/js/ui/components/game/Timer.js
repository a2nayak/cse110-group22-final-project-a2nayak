import { store } from '../../store.js';
/**
 * @module Timer
 */
/*
 * The component responsible for displaying the time remaining.
 * 
 * Expects the following minimal HTML structure:
 * <span class="timer"></span>
 */
export default class Timer {
    /** @type {number} The remaining amount of time, in seconds */
    #remainingTime;
    /** @type {number} The ending time, in milliseconds */
    #endTime;

    /**
     * Binds this Timer to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        this.endTime = 0;
        store.subscribe('questionEndTime', (/** @type {number} */ value) => this.endTime = value);
    }

    /**
     * Recomputes the remaining time based on the current time and the ending time, and updates the display.
     * @private
     */
    rerender() {
        this.remainingTime = Math.max(0, (this.#endTime - Date.now()) / 1000);
    }

    /**
     * Sets the ending time and updates the remaining time accordingly.
     * @param {number} newEndTime - The new ending time, in milliseconds.
     */
    set endTime(newEndTime) {
        this.#endTime = newEndTime;
        this.rerender();
    }

    /**
     * Gets the current ending time.
     * @returns {number} The current ending time, in milliseconds.
     */
    get endTime() {
        return this.#endTime;
    }

    /**
     * Sets the remaining time and updates the display.
     * @param {number} newTime - The new remaining time, in seconds.
     * @private
     */
    set remainingTime(newTime) {
        this.#remainingTime = newTime;
        const minutes = Math.floor(this.#remainingTime / 60);
        const seconds = Math.round(this.#remainingTime % 60);
        this.element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Gets the current remaining time.
     * @returns {number} The current remaining time, in seconds.
     * @private
     */
    get remainingTime() {
        return this.#remainingTime;
    }
}
