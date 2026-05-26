import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import ResultsScreen from './components/ResultsScreen.js';
import { assertHTMLElement } from './utils.js';
import * as glue from './glue.js';

/**
 * The main entry point for the UI.
 */

/** @type {GameUI} */
let gameUI;
/** @type {MainMenu} */
let mainMenu;
/** @type {ResultsScreen} */
let resultsScreen;

// TODO: update when multiple languages are added
/** @type {string} Last language the user started a game with, used for Retry. */
let lastLanguage = 'python';

/**
 * Initializes the UI and shows the main menu.
 */
function main() {
    glue.initializeBackend();

    const menuDisplayElement = assertHTMLElement(document.querySelector('#main-menu'));
    mainMenu = new MainMenu(menuDisplayElement);

    const gameDisplayElement = assertHTMLElement(document.querySelector('#game-ui'));
    gameUI = new GameUI(gameDisplayElement);
    gameUI.hide();

    const resultsScreenElement = assertHTMLElement(document.querySelector('.results-screen'));
    resultsScreen = new ResultsScreen(resultsScreenElement);
    resultsScreen.hide();

    mainMenu.onStart((language) => {
        lastLanguage = language;
        mainMenu.hide();
        gameUI.show();
        glue.startLevel(1, language);
    });

    resultsScreen.onRetry(() => {
        resultsScreen.hide();
        gameUI.show();
    });

    gameUI.onPause(glue.pauseGame);
    gameUI.onResume(glue.resumeGame);
    gameUI.codeInputField.onKeyPress(glue.handleKeyPress);

    resultsScreen.onMainMenu(() => {
        resultsScreen.hide();
        mainMenu.show();
        glue.goToMainMenu();
    });
}

// TODO: make sure this gets called eventually
/**
 * Call this when the game round ends to transition to the results screen.
 * @param {{ score: number, accuracy: string, cpm: number, questionsAnswered: number, totalQuestions: number }} stats
 */
export function showResults(stats) {
    gameUI.hide();
    resultsScreen.show({ ...stats, language: lastLanguage });
}

document.addEventListener('DOMContentLoaded', main);

export { gameUI, mainMenu, resultsScreen };