// Timer.js

/**
 * TimerType defines the two supported timer modes.
 *
 * stopwatch:
 *   Counts upward until manually stopped.
 *
 * countdown:
 *   Counts upward until total_time_used reaches time_limit,
 *   then automatically ends and calls the callback function.
 */
export const TimerType = {
    stopwatch: 0,
    countdown: 1,
};

/**
 * Timer class
 *
 * This class manages one timer instance.
 *
 * Features:
 * - Supports stopwatch and countdown modes
 * - Tracks elapsed time in "ticks"
 * - Allows custom ticks per second
 * - Records time used for each completed/stopped question
 * - Provides snapshot-style access to timer state
 *
 * Important terms:
 * - tick:
 *   One timer update unit. For example, if ticksPerSecond is 10,
 *   then 10 ticks = 1 second.
 *
 * - total_time_used:
 *   How many ticks have elapsed since the timer started.
 *
 * - time_limit:
 *   The maximum number of ticks allowed for countdown mode.
 *
 * Example:
 *   const timer = new Timer(TimerType.countdown, 10, 300);
 *
 * This means:
 *   - countdown timer
 *   - 10 ticks per second
 *   - 300 ticks total
 *   - 30 seconds total time limit
 */
export class Timer {
    /**
     * Creates a new Timer instance.
     *
     * @param {number} timerType
     *        The type of timer.
     *        Use TimerType.stopwatch or TimerType.countdown.
     *
     * @param {number} ticksPerSecond
     *        How many ticks happen per second.
     *        Example: 10 means the timer updates every 0.1 seconds.
     *
     * @param {number} timeLimit
     *        The countdown limit in ticks.
     *        Only used when timerType is TimerType.countdown.
     */
    constructor(timerType = TimerType.countdown, ticksPerSecond = 10, timeLimit = 300) {
        /**
         * Stores the time records for previous questions.
         *
         * Each record contains:
         * - timer_type
         * - ticks_per_second
         * - total_time_used
         * - time_limit
         */
        this.records = [];

        /**
         * Stores the setInterval ID.
         *
         * This is used so we can stop the timer later with clearInterval().
         */
        this.intervalId = null;

        /**
         * Stores the current timer state.
         *
         * start_time:
         *   The real-world timestamp when the timer starts.
         *
         * timer_type:
         *   The current timer mode.
         *
         * time_limit:
         *   The countdown limit in ticks.
         *
         * ticks_per_second:
         *   How many ticks happen per second.
         *
         * total_time_used:
         *   How many ticks have passed since the timer started.
         *
         * timer_ended:
         *   True if the timer has already ended or has been stopped.
         */
        this.settings = {
            start_time: 0,
            timer_type: timerType,
            time_limit: timeLimit,
            ticks_per_second: ticksPerSecond,
            total_time_used: 0,
            timer_ended: false,
        };
    }

    /**
     * Initializes the timer for a new question.
     *
     * This clears any existing running timer and resets the current timer state.
     * It does not clear previous question records.
     *
     * @param {number} timerType
     *        The timer mode.
     *
     * @param {number} ticksPerSecond
     *        How many ticks happen per second.
     *
     * @param {number} timeLimit
     *        The countdown limit in ticks.
     *        Only meaningful for countdown mode.
     *
     * @returns {void}
     */
    init(timerType, ticksPerSecond, timeLimit = 0) {
        this.clearTimer();

        this.settings.timer_type = timerType;
        this.settings.ticks_per_second = ticksPerSecond;
        this.settings.time_limit = timeLimit;

        this.settings.start_time = 0;
        this.settings.total_time_used = 0;
        this.settings.timer_ended = false;
    }

    /**
     * Starts the timer.
     *
     * For stopwatch mode:
     * - The timer keeps counting upward until stop() is called.
     *
     * For countdown mode:
     * - The timer counts upward until total_time_used reaches time_limit.
     * - Once the limit is reached, the timer stops automatically.
     * - The result is recorded.
     * - The callback function is called with the final timer result.
     *
     * @param {Function} callbackFunc
     *        Optional callback function.
     *        Called when a countdown timer finishes automatically.
     *
     * @returns {void}
     */
    start(callbackFunc) {
        this.clearTimer();

        this.settings.total_time_used = 0;
        this.settings.timer_ended = false;
        this.settings.start_time = Date.now();

        this.intervalId = setInterval(() => {
            if (this.settings.timer_ended) {
                this.clearTimer();
                return;
            }

            this.settings.total_time_used += 1;

            const isCountdown = this.settings.timer_type === TimerType.countdown;
            const reachedTimeLimit = this.settings.total_time_used >= this.settings.time_limit;

            if (isCountdown && reachedTimeLimit) {
                this.settings.timer_ended = true;
                this.clearTimer();

                const result = this.getCurrentSettings();

                this.recordTimeUsed(result);

                if (callbackFunc) {
                    callbackFunc(result);
                }
            }
        }, 1000 / this.settings.ticks_per_second);
    }

    /**
     * Stops the timer manually.
     *
     * This is used for both stopwatch and countdown timers.
     *
     * Behavior:
     * - If the timer has already ended, return the current settings.
     * - Otherwise, mark the timer as ended.
     * - Stop the interval.
     * - Record the time used.
     * - Call the callback function with the timer result.
     *
     * @param {Function} callbackFunc
     *        Optional callback function.
     *        Called when the timer is stopped manually.
     *
     * @returns {Object}
     *          A snapshot of the timer settings when stopped.
     */
    stop(callbackFunc) {
        if (this.settings.timer_ended) {
            return this.getCurrentSettings();
        }

        this.settings.timer_ended = true;
        this.clearTimer();

        const result = this.getCurrentSettings();

        this.recordTimeUsed(result);

        if (callbackFunc) {
            callbackFunc(result);
        }

        return result;
    }

    /**
     * Resets the current timer state.
     *
     * This stops the currently running timer and resets:
     * - start_time
     * - total_time_used
     * - timer_ended
     *
     * It does not change:
     * - timer_type
     * - time_limit
     * - ticks_per_second
     * - previous records
     *
     * @returns {void}
     */
    reset() {
        this.clearTimer();

        this.settings.start_time = 0;
        this.settings.total_time_used = 0;
        this.settings.timer_ended = false;
    }

    /**
     * Returns all recorded timer results.
     *
     * Each item represents one completed or stopped timer.
     *
     * @returns {Array<Object>}
     *          The list of recorded timer results.
     */
    getAllRecords() {
        return this.records;
    }

    /**
     * Clears all recorded timer results.
     *
     * This does not affect the currently running timer.
     *
     * @returns {void}
     */
    clearAllRecords() {
        this.records.length = 0;
    }

    /**
     * Returns a snapshot of the current timer settings.
     *
     * A new object is returned instead of the internal settings object.
     * This prevents outside code from directly modifying this.settings.
     *
     * @returns {Object}
     *          A copy of the current timer state.
     */
    getCurrentSettings() {
        return {
            start_time: this.settings.start_time,
            timer_type: this.settings.timer_type,
            time_limit: this.settings.time_limit,
            ticks_per_second: this.settings.ticks_per_second,
            total_time_used: this.settings.total_time_used,
            timer_ended: this.settings.timer_ended,
        };
    }

    /**
     * Records the time used for one question.
     *
     * This method is called when:
     * - a countdown timer ends automatically
     * - stop() is called manually
     *
     * Only important result fields are stored.
     *
     * @param {Object} result
     *        The timer result to record.
     *
     * @returns {void}
     */
    recordTimeUsed(result) {
        this.records.push({
            timer_type: result.timer_type,
            ticks_per_second: result.ticks_per_second,
            total_time_used: result.total_time_used,
            time_limit: result.time_limit,
        });
    }

    /**
     * Clears the active interval timer.
     *
     * This is a helper method used internally to avoid duplicated intervals.
     *
     * @returns {void}
     */
    clearTimer() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    updateTickPerSecond(newTicksPerSecond) {
        if (this.intervalId !== null) {
            console.debug("The timer is running right now, the tick per second will not be updated.", newTicksPerSecond);
            return;
        }
        this.settings.ticks_per_second = newTicksPerSecond;
    }
}