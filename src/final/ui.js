/**
 * ui.js
 *
 * Handles all DOM interaction. Listens for user events and calls into game.js,
 * then updates the display based on what game.js returns.
 * Never holds a reference to GameState directly.
 *
 * Main responsibilities:
 * - Register event listeners on page load (initEventListeners)
 * - Pass raw user input to game.js functions
 * - Update DOM to reflect game state 
 * - Manage screen transitions 
 *
 * Dependencies:
 * - game.js: startLevel(), onInput(), nextQuestion(), endGame(), pauseGame(), resumeGame()
 *
 * Exports:
 * - updateScore(score)
 * - updateTimer(time)
 * - displayQuestion(word)
 * - displayResult(correct)
 * - initEventListeners()
 */
