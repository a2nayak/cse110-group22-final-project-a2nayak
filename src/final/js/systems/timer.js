/**
 * timer.js
 *
 * Manages the countdown timer for an active game session.
 * Tracks time internally — does not read or write state directly.
 * Returns updated time through onTick each second for game.js to handle.
 *
 * Imported by:
 * - game.js: calls startTimer() when a level begins, stopTimer() on pause or game end
 */

let intervalId = null;
let timeRemaining = 0;

/**
 * Starts the countdown timer from state.timer.
 * Calls onTick each second with the updated time remaining.
 * Calls onExpire when time reaches 0.
 * @param {object} state - A copy of game state; reads state.timer as starting seconds
 * @param {function(number): void} onTick - Called every second with the updated time
 * @param {function(): void} onExpire - Called when the timer reaches 0
 */
export function startTimer(state, onTick, onExpire) {
  stopTimer();
  timeRemaining = state.timer;
  intervalId = setInterval(() => {
    timeRemaining--;
    onTick(timeRemaining);
    if (timeRemaining <= 0) {
      stopTimer();
      onExpire();
    }
  }, 1000);
}

/**
 * Stops the countdown timer without triggering onExpire.
 * Safe to call even if the timer is not running.
 */
export function stopTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Returns whether the timer is currently running.
 * @returns {boolean}
 */
export function isRunning() {
  return intervalId !== null;
}