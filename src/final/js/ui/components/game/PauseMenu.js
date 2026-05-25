export default class PauseMenu {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.element.classList.add('hidden');
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
}
