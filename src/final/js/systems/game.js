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
 * - level.js: loadLevel()
 * - timer.js: startTimer(), stopTimer()
 * - scoring.js: calculateScore()
 * - storage.js: loadProfile(), saveProfile(), loadState(), saveState()
 * - models.js: defaultGameState(), defaultProfile()
 *
 * Exports:
 * - startLevel(levelNumber, category)
 * - nextQuestion()
 * - onInput(key)
 * - endGame()
 * - pauseGame() / resumeGame()
 */
