import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import ResultsScreen from './components/ResultsScreen.js';
import { assertHTMLElement } from './utils.js';

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
        const [question, answer] = backendEmulator();
        gameUI.sendQuestion(question, answer);
    });

    resultsScreen.onRetry(() => {
        resultsScreen.hide();
        gameUI.show();
        const [question, answer] = backendEmulator();
        gameUI.sendQuestion(question, answer);
    });

    // TODO: wire gameUI.pauseMenu.onMainMenu to hide the game and show the main menu

    resultsScreen.onMainMenu(() => {
        resultsScreen.hide();
        mainMenu.show();
    });
}

function backendEmulator(){
    //return a tuple of (question, answer)
    return ["Print \"Hello, World!\" in Python", "print(\"Hello, World!\")"];
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