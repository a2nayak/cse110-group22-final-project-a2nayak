/**
 * game.js
 *
 * Central game engine. Owns the active GameState and Profile, coordinates
 * all other modules, and exposes functions for ui.js to call.
 *
 * Main responsibilities:
 * - Initialize and own GameState and Profile
 * - Handle game lifecycle (startLevel, nextQuestion, endGame, pauseGame)
 * - Process player input (onInput) and update state accordingly
 * - Coordinate modules: level.js, scoring.js, timer.js, storage.js
 * - Return results to ui.js after each state change
 *
 * Dependencies:
 * - level.js: loadLevel(), ...
 * - timer.js: startTimer(), stopTimer(), ...
 * - scoring.js: calculateScore(), ...
 * - storage.js: loadProfile(), saveProfile(), loadState(), saveState(), ...
 * - models.js: defaultGameState(), defaultProfile(), ...
 *
 * Exports:
 * - startLevel(levelNumber, category)
 * - nextQuestion()
 * - onInput(key)
 * - onTick(time)
 * - endGame()
 * - pauseGame() / resumeGame()
 */

/**
 * Called every second by the timer via the onTick callback.
 * Updates state.elapsed_time then notifies ui.js.
 * Passed into startTimer() when a level begins. Never called directly by ui.js.
 * @param {number} time - The current time remaining in seconds from timer.js
 */
/*
function onTick(time) {
  // TODO: update state.elapsed_time
  // TODO: call ui callback to update timer display
}
  */