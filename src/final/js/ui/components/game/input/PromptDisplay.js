import { assertHTMLElement } from "../../../utils.js";

/**
 * The component responsible for displaying the current prompt to the user.
 * 
 * Expects the following minimal HTML structure:
 * <div class="prompt-display">
 *   <p class="prompt-display-text"></p>
 * </div>
 */
export default class PromptDisplay {
    /**
     * Binds this PromptDisplay to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.element = element;
        this.promptTextElement = assertHTMLElement(this.element.querySelector('.prompt-display-text'));
    }

    /**
     * Sets the text of the prompt display.
     * @param {String} text - The text to display.
     */
    setText(text) {
        this.promptTextElement.textContent = text;
    }
}