import GameUI from './components/GameUI.js';
import { assertHTMLElement } from './utils.js';

/**
 * The main entry point for the UI.
 */

/** @type {GameUI} */
let gameUI;

/**
 * Initializes the UI.
 */
function main() {
    const gameDisplayElement = assertHTMLElement(document.querySelector('#game-ui'));
    gameUI = new GameUI(gameDisplayElement);
    
    const [question, answer] = backendEmulator();
    gameUI.sendQuestion(question, answer);
}

function backendEmulator(){
    //return a tuple of (question, answer)
    return ["Print \"Hello, World!\" in Python", "print(\"Hello, World!\")"];
}


document.addEventListener('DOMContentLoaded', main);