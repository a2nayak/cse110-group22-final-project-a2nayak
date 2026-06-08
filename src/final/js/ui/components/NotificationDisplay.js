import { assertHTMLElement } from "../utils.js";
/**
 * @module NotificationDisplay
 */
/*
 * NotificationDisplay
 * 
 * Displays temporary notifications at the top of the game UI.
 * 
 * Expects the following HTML structure:
 * 
 * <div class="notification-display">
 *   <span class="notification-display-text"></span>
 * </div>
 */

export default class NotificationDisplay {
    /** @const {number} */
    static DISPLAY_DURATION = 1750;

    /**
     * Binds this NotificationDisplay to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element; 
        this.textElement = assertHTMLElement(this.element.querySelector('.notification-display-text'));
        this.timeoutId = null; 
    }

    /**
     * Displays a notification with the given event message and color.
     * @param {string} event 
     * @param {string} color 
     */
    notifyEvent(event, color) {
        this.textElement.textContent = event;
        this.element.style.backgroundColor = color;

        this.element.classList.add('notification-visible');
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            this.element.classList.remove('notification-visible');
        }, NotificationDisplay.DISPLAY_DURATION);
    }
}
    


