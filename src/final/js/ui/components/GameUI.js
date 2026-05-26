import { assertHTMLElement } from "../utils.js";
import CodeInputField from "./game/input/CodeInputField.js";
import PromptDisplay from "./game/input/PromptDisplay.js";
import StatsDisplay from "./game/StatsDisplay.js";
import PlantDisplayGroup from "./game/plants/PlantDisplayGroup.js";
import GameTray from "./game/tray/GameTray.js";
import Combo from "./game/Combo.js";
import Timer from "./game/Timer.js";

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
    currentQuestion = "";
    currentAnswer = "";
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
        this.gameTray = new GameTray(assertHTMLElement(this.element.querySelector('.game-tray')));
        this.timer = new Timer(assertHTMLElement(this.element.querySelector('.timer')));
        this.combo = new Combo(assertHTMLElement(this.element.querySelector('.combo')));

        this.timer.remainingTime = 120; //DEBUG: set initial time to 2 minutes
        this.codeInputField.onEnter((text) => this.handleAnswer(text));
        this.codeInputField.onInputChange((text) => this.handleInputChange(text)); //DEBUG: handle answer on input change for easier testing
        //callback that repeats every second to decrement the timer and check for timeout
        setInterval(() => {
            if(this.timer.remainingTime > 0){
                this.timer.remainingTime--;
            } else {
                console.log("Time's up! The correct answer was: " + this.currentAnswer);
                this.timer.remainingTime = 120; //DEBUG: reset timer for easier testing
            }
         }, 1000);
    }

    /**
     * Sends a question to the prompt display.
     * @param {String} question - The question to display.
     * @param {String} answer - The answer to display.
     */
    sendQuestion(question, answer) {
        if(!this.promptDisplay || !this.codeInputField) return;
        this.promptDisplay.setText(question);
        this.codeInputField.setGhostText(answer);

        this.currentQuestion = question;
        this.currentAnswer = answer;
    }

    /**
     * Handles changes to the input field and updates the combo accordingly.
     * @param {string} text 
     */
    handleInputChange(text) {
        //compute the prefix match length between text and currentAnswer
        const prefix = this.currentAnswer.substring(0, text.length);
        if(prefix === text){
            this.combo.increment(); // Increment combo on correct prefix
        } else {
            this.combo.reset(); // Reset combo on incorrect prefix
        }
    }

    /**
     * Handles the user's answer.
     * @param {string} answer 
     */
    handleAnswer(answer){
        if(answer === this.currentAnswer){
            console.log("Correct!");
            this.plantDisplayGroup.addPlant();
        } else {
            console.log("Incorrect! The correct answer was: " + this.currentAnswer);
        }
    }
}