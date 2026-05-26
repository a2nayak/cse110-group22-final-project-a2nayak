
/**
 * The component responsible for displaying the time remaining.
 * 
 * Expects the following minimal HTML structure:
 * <span class="timer"></span>
 */
export default class Timer {
    
    /** @type {number} The remaining amount of time, in seconds */
    #remainingTime = 0;

    /**
     * Binds this Timer to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
    }

    /**
     * Sets the remaining time and updates the display.
     * @param {number} newTime - The new remaining time, in seconds.
     */
    set remainingTime(newTime) {
        this.#remainingTime = newTime;
        const minutes = Math.floor(this.#remainingTime / 60);
        const seconds = this.#remainingTime % 60;
        this.element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Gets the current remaining time.
     * @returns {number} The current remaining time, in seconds.
     */
    get remainingTime() {
        return this.#remainingTime;
    }
}
