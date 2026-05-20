import { assertHTMLElement, assertHTMLInputElement } from '../../utils.js';
/**
 * The component responsible for taking in the user's code input.
 * 
 * Expects the following minimal HTML structure:
 *  <div id="game-code-input-field" class="code-input-field">
 *      <div class="ghost-text">
 *          <span class="ghost-text-invisible"></span>
 *          <span class="ghost-text-visible"></span>
 *      </div>
 *      <input class="code-input" />
 *  </div>
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
        this.codeInput = assertHTMLInputElement(this.element.querySelector('.code-input'));

        // Add event listeners
        this.codeInput.addEventListener('input', () => this.handleInput());
        this.renderGhostText();
    }

    /**
     * Sets what the ghost text should be. 
     * This is the text that appears as a hint for the user, but disappears as they type.
     * @param {String} text 
     */
    setGhostText(text) {
        this.ghostTextString = text;
        console.log('Setting ghost text to: ' + text);
        this.renderGhostText();
    }

    /**
     * Renders the ghost text based on the current input value. 
     * The part of the ghost text that overlaps with the input value is rendered in the "invisible" span, while the rest is rendered in the "visible" span.
     */
    renderGhostText() {
        //TODO: check for input validity
        const value = this.codeInput.value;
        this.ghostTextInvisible.textContent = this.codeInput.value;
        this.ghostTextVisible.textContent = this.ghostTextString.substring(value.length);
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
        if(!callback) return;
        this.codeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') callback(this.codeInput.value);
        });
    }

}
