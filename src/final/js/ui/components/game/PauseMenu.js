import { assertHTMLElement } from "../../utils.js";
import { store } from "../../store.js";

/**
 * @module PauseMenu
 */
/*
 * The component responsible for displaying the pause menu.
 * 
 * Expects the following minimal HTML structure:
 * <div class="pause-menu">
 *   <h3 class="pause-menu-title">Paused</h3>
 *   ...<button type="button" class="pause-menu-resume">Resume</button>
 *   ...<button type="button" class="pause-menu-retry">Retry</button>
 *   ...<button type="button" class="pause-menu-main-menu">Main Menu</button>
 *   <h4 class="pause-menu-current-language"></h4>
 * </div>
 */
export default class PauseMenu {
    /** @type {HTMLButtonElement} */
    resumeBtn;
    /** @type {HTMLButtonElement} */
    retryBtn;
    /** @type {HTMLButtonElement} */
    mainMenuBtn;

    /**
     * Binds this PauseMenu to the given element and sets up event listeners for the buttons and language display.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element; 
        this.element.classList.add('hidden');
        this.resumeBtn = assertHTMLElement(this.element.querySelector('.pause-menu-resume'));
        this.retryBtn = assertHTMLElement(this.element.querySelector('.pause-menu-retry'));
        this.mainMenuBtn = assertHTMLElement(this.element.querySelector('.pause-menu-main-menu'));
        this.currentLangEl = assertHTMLElement(this.element.querySelector('.pause-menu-current-language'));
        this.focusableElements = [this.resumeBtn, this.retryBtn, this.mainMenuBtn];
        this._previouslyFocused = null;
        store.subscribe('language', (language) => this.language = language);
        this.setupFocusTrap(); 
    }

    /**
     * Sets up a keydown listener on the pause menu to trap Tab focus within the menu's buttons.
     */
    setupFocusTrap() {
        this.element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            const first = this.focusableElements[0];
            const last = this.focusableElements[this.focusableElements.length - 1];
            
            if(e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            if(!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    /**
     * Shows the pause menu, saves the previously focused element, and focuses the Resume button.
     */
    show(){
        this.element.classList.remove('hidden');
        this.previouslyFocused = document.activeElement;
        this.element.focus();
    }
    
    /**
     * Hides the pause menu and restores focus to the previously focused element.
     */
    hide(){
        this.element.classList.add('hidden');
        if(!this.previouslyFocused) return;
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
    }
    

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
    
    /**
     * Registers a callback to be called when the user clicks the Retry button.
     * @param {() => void} callback 
     */
    onRetry(callback){
        this.retryBtn.addEventListener('click', () => {
            callback();
            this.hide();
        });
    }

    /**
     * Registers a callback to be called when the user clicks the Main Menu button.
     * @param {() => void} callback 
     */
    onMainMenu(callback){
        this.mainMenuBtn.addEventListener('click', () => {
            callback();
            this.hide();
        });
    }

    /**
     * TODO: this method should probably be refactored
     * Returns whether the pause menu is currently visible.
     * @returns {boolean} True if the pause menu is visible, false
     */
    get isVisible(){
        return !this.element.classList.contains('hidden');
    }

    /**
     * Sets the current language displayed in the pause menu.
     */
    set language(language) {
        const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
        this.currentLangEl.textContent = `Language:\u00A0 ${capitalizedLanguage}`;
    }
}
