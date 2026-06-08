import { assertHTMLElement, assertHTMLInputElement } from '../../../utils.js';
/**
 *  Expects the following minimal HTML structure:
 *  <div id="game-code-input-field" class="code-input-field">
 *      <div class="ghost-text">
 *          <span class="ghost-text-invisible"></span>
 *          <span class="ghost-text-visible"></span>
 *      </div>
 *      <div class="code-input-highlight" aria-hidden="true">
 *          <span class="highlight-correct"></span>
 *          <span class="highlight-error"></span>
 *      </div>
 *      <input class="code-input" />
 *  </div>
 */

/**
 * The component responsible for taking in the user's code input.
 */
export default class CodeInputField {
    /**
     * Creates an input field and binds it to the given element.
     * @param {HTMLElement} element - The input field element to bind to.
     */
    constructor(element) {
        this.element = element;
        this.ghostTextString = 'print("Hello, World!")';
        this.ghostTextInvisible = assertHTMLElement(this.element.querySelector('.ghost-text-invisible'));
        this.ghostTextVisible = assertHTMLElement(this.element.querySelector('.ghost-text-visible'));
        this.highlightCorrect = assertHTMLElement(this.element.querySelector('.highlight-correct'));
        this.highlightError = assertHTMLElement(this.element.querySelector('.highlight-error'));
        this.codeInput = assertHTMLInputElement(this.element.querySelector('.code-input'));

        // Add event listeners
        this.codeInput.addEventListener('input', () => this.handleInput());
        this.renderGhostText();
    }

    /**
     * Clears the input field and resets the ghost text.
     */
    clearAnswer() {
        this.codeInput.value = '';
        this.renderGhostText();
    }

    /**
     * Sets what the ghost text should be. 
     * This is the text that appears as a hint for the user, but disappears as they type.
     * @param {String} text 
     */
    setGhostText(text) {
        this.ghostTextString = text;
        this.renderGhostText();
    }

    /**
     * Renders the ghost text based on the current input value. 
     * The part of the ghost text that overlaps with the input value is rendered in the "invisible" span, while the rest is rendered in the "visible" span.
     */
    renderGhostText() {
        if(!this.ghostTextString) return;
        const value = this.codeInput.value;
        this.ghostTextInvisible.textContent = this.codeInput.value;
        this.ghostTextVisible.textContent = this.ghostTextString.substring(value.length);
    
        this.errorHighlight();
    }

    /**
     * Error highlighting for the input field. If the user's input matches the corresponding portion of the ghost text, the error highlight is removed. Otherwise, an error highlight is added to indicate a mistake.
     */
    errorHighlight() {
        if (!this.ghostTextString) return;
        const value = this.codeInput.value;
        if (!value) {
            this.highlightCorrect.textContent = '';
            this.highlightError.textContent = '';
            return;
        }

        let matchIndex = 0;
        const compareLen = Math.min(value.length, this.ghostTextString.length);
        while (matchIndex < compareLen && value[matchIndex] === this.ghostTextString[matchIndex]) {
            matchIndex++;
        }

        this.highlightCorrect.textContent = value.substring(0, matchIndex);
        this.highlightError.textContent = this.ghostTextString.substring(matchIndex, value.length);
    }
    /**
     * Event handler for when the input value changes. 
     * Rerenders the ghost text to reflect the new input value.
     */
    handleInput(){ 
        this.renderGhostText();
    }

    /**
     * Event handler for when the user presses the Enter key.
     * @param {(text: string) => void} callback - The function to call when the user presses Enter. The current input value will be passed as an argument to this function.
     */
    onEnter(callback) {
        this.codeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') callback(this.codeInput.value);
        });
    }

    /**
     * Event handler for when the input value changes.
     * @param {(text: string) => void} callback 
     */
    onInputChange(callback) {
        this.codeInput.addEventListener('input', () => callback(this.codeInput.value));
    }

    /**
     * Event handler for when a key is pressed in the input field.
     * @param {(key: string) => void} callback 
     */
    onKeyPress(callback) {
        this.codeInput.addEventListener('keypress', (event) => {
            setTimeout(() => callback(event.key), 0);
        });
    }

    /**
     * Focuses the input field, allowing the user to start typing immediately.
     */
    focus() {
        this.codeInput.focus();
    }
}
