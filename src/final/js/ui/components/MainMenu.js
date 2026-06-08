/**
 * @module MainMenu
 */
/*
 * The main menu component for the game.
 *
 * Expects the following minimal HTML structure:
 * <div id="main-menu">
 *   <h1>Typing Game</h1>
 *   <ul class="main-menu-language-list">
 *     <li><button class="main-menu-btn" data-language="python">Python</button></li>
 *   </ul>
 * </div>
 */
export default class MainMenu {
    /** @type {NodeListOf<HTMLButtonElement>} */
    languageButtons;

    /**
     * Binds this MainMenu to the given element.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.languageButtons = this.element.querySelectorAll('.main-menu-btn');
    }

    /**
     * Registers a callback to be called when the user selects a language.
     * @param {(language: string) => void} callback - Called with the language value from data-language.
     */
    onStart(callback) {
        this.languageButtons.forEach(btn => {
            btn.addEventListener('click', () => callback(btn.dataset.language));
        });
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }
}
