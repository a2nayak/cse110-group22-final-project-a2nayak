import { timer_type } from "./timer.js";
var total_game_score = 0;
var streak_multiplier = 1;
var current_streak = 0;
var callback_func = null;
var MAX_TIME_BONUS = 500;
var TIME_BONUS_MULTIPLIER = 5; // Multiplier for time bonus calculation, can be adjusted based on desired scoring balance
export function initScoring(callback) {
    total_game_score = 0;
    streak_multiplier = 1;
    current_streak = 0;
    callback_func = callback;
}

// Getter function to retrieve the current total game score
// Returns an integer representing the total score accumulated in the game
export function getScore() {
    return total_game_score;
}

// Getter function to retrieve the current streak
// Returns an integer representing the current streak of correct answers
export function getStreak() {
    return current_streak;
}

// Helper function to add a specified score to the total game score
// Parameters:
// - score: An integer representing the score to be added to the total game score
function addScore(score) {
    total_game_score += score;
    if (callback_func) {
        callback_func(total_game_score);
    }
}

// Function to reset the total game score back to zero
export function resetScore() {
    total_game_score = 0;
    current_streak = 0;
    streak_multiplier = 1;

    if (callback_func) {
        callback_func(total_game_score);
    }
}

function normalizeWhitespace(str) {
    return str.trim().replace(/\s+/g, " ");
}

function checkSyntaxMatch(user_answer, correct_answer) {
    return normalizeWhitespace(user_answer) === normalizeWhitespace(correct_answer);
}

function calculateTypingAccuracy(user_answer, correct_answer) {
    const maxLength = Math.max(user_answer.length, correct_answer.length);

    if (maxLength === 0) {
        return 0;
    }

    let correctChars = 0;

    for (let i = 0; i < maxLength; i++) {
        if (user_answer[i] === correct_answer[i]) {
            correctChars++;
        }
    }

    return correctChars / maxLength;
}

function calculateTimeBonus(timerResults) {
    if (timerResults.timer_type === timer_type.countdown) {
        const time_left = Math.max(
            0,
            timerResults.time_limit - timerResults.total_time_used
        );

        return Math.min(
            time_left * TIME_BONUS_MULTIPLIER,
            MAX_TIME_BONUS
        );
    }

    return Math.max(
        0,
        MAX_TIME_BONUS - timerResults.total_time_used
    );
}

export function compareAnswer(user_answer, correct_answer, timerResults, base_score = 100) {
    const syntax_correct = checkSyntaxMatch(user_answer, correct_answer);
    const exact_match = user_answer === correct_answer;
    const typing_accuracy = calculateTypingAccuracy(user_answer, correct_answer);

    if (syntax_correct) {
        current_streak += 1;
        streak_multiplier = Math.min(2, 1 + current_streak * 0.1);
    } else {
        current_streak = 0;
        streak_multiplier = 1;
    }

    let earned_score = 0;

    if (syntax_correct) {
        const time_bonus = calculateTimeBonus(timerResults);

        earned_score = Math.round(
            (base_score + time_bonus) * typing_accuracy * streak_multiplier
        );

        addScore(earned_score);
    }

    return {
        syntax_correct,
        exact_match,
        typing_accuracy,
        current_streak,
        streak_multiplier,
        earned_score,
        total_game_score
    };
}