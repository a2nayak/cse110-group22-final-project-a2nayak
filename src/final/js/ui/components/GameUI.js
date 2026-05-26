import { assertHTMLElement } from "../utils.js";
import CodeInputField from "./game/input/CodeInputField.js";
import PromptDisplay from "./game/input/PromptDisplay.js";
import StatsDisplay from "./game/StatsDisplay.js";
import PauseMenu from "./game/PauseMenu.js";
import PlantDisplayGroup from "./game/plants/PlantDisplayGroup.js";
import GameTray from "./game/tray/GameTray.js";
import Combo from "./game/Combo.js";
import Timer from "./game/Timer.js";
import { store } from "../store.js";

/**
 * The main component for displaying the game. It will contain the game board and any other relevant information. 
 * 
 * Expects the following minimal HTML structure:
 * <div class="game-ui">
 *   <CodeInputField class="code-input-field" />
 *   <StatsDisplay class="stats-display" />
 *   <PromptDisplay class="prompt-display" />
 *   <GameTray class="game-tray" />
 * </div>
 */
export default class GameUI {
    /**
     * Binds this GameUI to the given element.
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.statsDisplay = new StatsDisplay(assertHTMLElement(this.element.querySelector('.stats-display')));
        this.codeInputField = new CodeInputField(assertHTMLElement(this.element.querySelector('.code-input-field')));
        this.promptDisplay = new PromptDisplay(assertHTMLElement(this.element.querySelector('.prompt-display')));
        this.plantDisplayGroup = new PlantDisplayGroup(assertHTMLElement(this.element.querySelector('.plant-display-group')));
        this.timer = new Timer(assertHTMLElement(this.element.querySelector('.timer')));
        this.combo = new Combo(assertHTMLElement(this.element.querySelector('.combo')));

        this.pauseMenu = new PauseMenu(assertHTMLElement(this.element.querySelector('.pause-menu')));
        this.onPause(() => this.pauseMenu.show());
        this.onResume(() => this.pauseMenu.hide());
        
        this.gameTray = new GameTray(assertHTMLElement(this.element.querySelector('.game-tray')));
        
        store.subscribe('timer', (/** @type {number} */ value) => this.timer.remainingTime = value);
    }

    /**
     * Sends a question to the prompt display.
     * @param {String} question - The question to display.
     * @param {String} answer - The answer to display.
     */
    sendQuestion(question, answer) {
        if(!this.promptDisplay || !this.codeInputField) return;
        this.codeInputField.clearAnswer();
        this.promptDisplay.setText(question);
        this.codeInputField.setGhostText(answer);
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    /**
     * Adds an event listener for when the user clicks the pause button, which will show the pause menu.
     * @param {() => void} callback 
     */
    onPause(callback) {
        const pauseMenuButton = assertHTMLElement(this.element.querySelector('.game-header-pause'));
        pauseMenuButton.addEventListener('click', callback);
    }

    /**
     * Registers a callback to be called when the user clicks the Resume button in the pause menu, which will hide the pause menu.
     * @param {() => void} callback
     */
    onResume(callback) {
        this.pauseMenu.onResume(callback);
    }
}