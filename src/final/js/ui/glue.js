import {
    registerCallbacks, startLevel, pauseGame, resumeGame, 
    goToMainMenu, goToLevelSelect, onInput
} from "../systems/game.js"

import { store } from "./store.js";
import { mainMenu, gameUI, resultsScreen } from "./ui.js";

/**
 * @param {string} screenName 
 * @param {*} data 
 */
function handleLoadScreen(screenName, data) {
    if (screenName === 'game') {
        mainMenu.hide();
        resultsScreen.hide();
        gameUI.show();
        gameUI.sendQuestion(data.questions[data.current_question_index], data.answers[data.current_question_index]);
    }
    if (screenName === 'pause') {
        gameUI.show();
        gameUI.pauseMenu.show();
        resultsScreen.hide();
        mainMenu.hide();
    }
    if (screenName === 'endscreen') {
        gameUI.hide();
        //TODO: pass real data here
        resultsScreen.show({ 
            score: 0,
            questionsAnswered: 0,
            totalQuestions: 0,
            accuracy: '0%',
            cpm: 0,
            language: 'python'
        });
        mainMenu.hide();
    }
    if (screenName === 'mainmenu' || screenName === 'levelselect') {
        gameUI.hide();
        resultsScreen.hide();
        mainMenu.show();
    }
}

/**
 * @param {string} response 
 * @param {*} data 
 */
function handleUpdateScreen(response, data) {
    if (response === 'tick') {
        store.update('timer', data.timer);
    }
    if (response === 'correct-char') {
        gameUI.combo.increment();
    }
    if (response === 'incorrect') {
        gameUI.combo.reset();
    }
    if (response === 'next-question') {
        gameUI.sendQuestion(data.questions[data.current_question_index], data.answers[data.current_question_index]);
    }
}

export function initializeBackend() {
    registerCallbacks(handleLoadScreen, handleUpdateScreen);
}

/**
 * Relays user input from the UI to the backend.
 * @param {string} key 
 */
export function handleKeyPress(key){
    console.log(`Key pressed: ${key}`);
    onInput(key); //backend naming is different from our convention
}

export { startLevel, pauseGame, resumeGame, goToLevelSelect, goToMainMenu };