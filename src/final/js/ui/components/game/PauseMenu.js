import { assertHTMLElement } from "../../utils.js";

export default class PauseMenu {
    /** @type {HTMLElement} */
    resumeBtn;
    
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.element.classList.add('hidden');
        this.resumeBtn = assertHTMLElement(this.element.querySelector('.pause-menu-resume'));
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    get isVisible() {
        return !this.element.classList.contains('hidden');
    }

    // TODO: add onResume(callback) that fires when the Resume button is clicked
    // TODO: add onMainMenu(callback) that fires when the Return to Menu button is clicked
    /**
     * Registers a callback to be called when the user clicks the Resume button.
     * @param {() => void} callback 
     */
    onResume(callback) {
        this.resumeBtn.addEventListener('click', () => {
            callback();
            this.hide();
        });
    }
}
