import { assertHTMLElement } from "../utils.js";
import CodeInputField from "./game/CodeInputField.js";
import PromptDisplay from "./game/PromptDisplay.js";
import StatsDisplay from "./game/StatsDisplay.js";
import PlantsGroup from "./game/PlantDisplayGroup.js";
import PlantDisplayGroup from "./game/PlantDisplayGroup.js";

/**
 * The main component for displaying the game. It will contain the game board and any other relevant information. 
 * 
 * Expects the following minimal HTML structure:
 * <div class="game-ui">
 *   <CodeInputField class="code-input-field" />
 *   <StatsDisplay class="stats-display" />
 *   <PromptDisplay class="prompt-display" />
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

        this.codeInputField.onEnter((text) => this.handleAnswer(text));
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
     * Handles the user's answer.
     * @param {String} answer 
     */
    handleAnswer(answer){
        if(answer === this.currentAnswer){
            console.log("Correct!");
        } else {
            console.log("Incorrect! The correct answer was: " + this.currentAnswer);
        }
    }
}