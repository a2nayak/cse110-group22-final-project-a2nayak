import { assertHTMLElement, assertHTMLSelectElement } from "../utils.js";

/**
 * The main menu component for the game.
 *
 * Expects the following minimal HTML structure:
 * <div class="main-menu">
 *   <select class="main-menu-language-select">
 *     <option value="python">Python</option>
 *   </select>
 *   <button type="button" class="main-menu-start">Start Game</button>
 * </div>
 */
export default class MainMenu {
    /** @type {(language: string) => void} */
    #startCallback = () => {};
    /** @type {HTMLSelectElement} */
    #languageSelect;
    /** @type {HTMLElement} */
    #startButton;

    /**
     * Binds this MainMenu to the given element.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.#languageSelect = assertHTMLSelectElement(this.element.querySelector('.main-menu-language-select'));
        this.#startButton = assertHTMLElement(this.element.querySelector('.main-menu-start'));

        this.#startButton.addEventListener('click', () => this.#startCallback(this.#languageSelect.value));
    }

    /**
     * Registers a callback to be called when the user starts the game.
     * @param {(language: string) => void} callback - Called with the selected language value.
     */
    onStart(callback) {
        this.#startCallback = callback;
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }
}
