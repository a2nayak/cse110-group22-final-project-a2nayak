const time_used_each_question = []
export const timer_type = {
    stopwatch:0,
    countdown:1
}
var timer_settings = {
    start_time: 0, // current time in real world when the timer starts, in milliseconds
    timer_type: timer_type.countdown,   
    time_limit: 300, // ticks, only works for countdown timer
    ticks_per_second: 10,
    total_time_used: 0, // ticks
    timer_ended: false
};
var timer;

// Helper function to record the time used for each question, called when the timer stops or ends
function recordTimeUsed(result) {
    time_used_each_question.push({
        timer_type: result.timer_type,
        ticks_per_second: result.ticks_per_second,
        total_time_used: result.total_time_used,
        time_limit: result.time_limit
    });
}

// Initializes the timer for a new question
// params: timer_type: 0 for stopwatch, 1 for countdown
//         ticks_per_second: how many ticks in one second, used for both timer types
//         time_limit: how many ticks before the timer runs out, only used for countdown timer
export function TimerInit(timer_type, ticks_per_second, time_limit = 0) {
    clearInterval(timer);

    timer_settings.timer_type = timer_type;
    timer_settings.ticks_per_second = ticks_per_second;
    timer_settings.time_limit = time_limit;

    timer_settings.total_time_used = 0;
    timer_settings.timer_ended = false;
}

// Starts the timer
// params: callback_func: a callback function for countdown timer, called when the timer ends and receives the timer results as a parameter
export function TimerStart(callback_func) {
    clearInterval(timer);
    timer_settings.total_time_used = 0;
    timer_settings.timer_ended = false;
    timer_settings.start_time = Date.now();
    timer = setInterval(() => {
        if (timer_settings.timer_ended) {
            clearInterval(timer);
            return;
        }
        timer_settings.total_time_used += 1;
        if (timer_settings.timer_type === timer_type.countdown) {
            if (timer_settings.total_time_used >= timer_settings.time_limit) {
                clearInterval(timer);

                timer_settings.timer_ended = true;

                const result = { ...timer_settings }; // freeze snapshot

                recordTimeUsed(result);

                if (callback_func) {
                    callback_func(result);
                }
            }   
        }
    }, 1000/timer_settings.ticks_per_second);
}

// Stops the timer and records the time used, then calls the callback function with the timer results
// params: callback_func: a callback function for both timer types, called when the timer stops and receives the timer results as a parameter
export function TimerStop(callback_func) {
    if (timer_settings.timer_ended) {
        return timer_settings;
    }

    timer_settings.timer_ended = true;
    clearInterval(timer);

    recordTimeUsed(timer_settings);

    if (callback_func) {
        callback_func(timer_settings);
    }

    return timer_settings;
}

// Resets the timer settings for a new question, does not affect the recorded time used for previous questions
export function TimerReset() {
    clearInterval(timer);

    timer_settings.start_time = 0;
    timer_settings.total_time_used = 0;
    timer_settings.timer_ended = false;
}

// Returns the recorded time used for all questions
export function GetAllTimerRecords() {
    return time_used_each_question;
}

export function ClearAllTimerRecords() {
    time_used_each_question.length = 0;
}
export function GetCurrentTimerSettings() {
    return {
        start_time: timer_settings.start_time,
        timer_type: timer_settings.timer_type,
        time_limit: timer_settings.time_limit,
        ticks_per_second: timer_settings.ticks_per_second,
        total_time_used: timer_settings.total_time_used,
        timer_ended: timer_settings.timer_ended
    };
}