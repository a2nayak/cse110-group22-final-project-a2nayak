import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import { assertHTMLElement } from './utils.js';

/**
 * The main entry point for the UI.
 */

/** @type {GameUI} */
let gameUI;
/** @type {MainMenu} */
let mainMenu;

/**
 * Initializes the UI and shows the main menu.
 */
function main() {
    const menuDisplayElement = assertHTMLElement(document.querySelector('#main-menu'));
    mainMenu = new MainMenu(menuDisplayElement);

    const gameDisplayElement = assertHTMLElement(document.querySelector('#game-ui'));
    gameUI = new GameUI(gameDisplayElement);
    gameDisplayElement.classList.add('hidden');

    mainMenu.onStart((language) => {
        menuDisplayElement.classList.add('hidden');
        gameDisplayElement.classList.remove('hidden');
        const [question, answer] = backendEmulator();
        gameUI.sendQuestion(question, answer);
    });
}

function backendEmulator(){
    //return a tuple of (question, answer)
    return ["Print \"Hello, World!\" in Python", "print(\"Hello, World!\")"];
}


document.addEventListener('DOMContentLoaded', main);