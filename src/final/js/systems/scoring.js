// deterministic pure functions to calculate score of a question based on time taken 
// and number of attempts, and to calculate total score of the game based on individual question scores
// also handles streaks and multipliers down the line

//none of the functions in this file should be able to directly mutate the game state
//instead they should return values that can be used to update the game state in game.js

export function calculateTypingAccuracy(incorrectChars, totalChars) {
    if (totalChars === 0) return 1;

  const accuracy = (totalChars - incorrectChars) / totalChars;

  // clamp to prevent extreme punishment/boost
  return Math.max(0.5, accuracy); // 50% minimum
}

export function calculateTimeBonus(timeElapsed, timeLimit, level) {
    if (timeLimit === 0) return 1;

    const ratio = timeElapsed / timeLimit;

    // faster = higher reward
    const multiplier = 1 + (1 - ratio);

    // clamp so it doesn't explode
    return Math.max(0.7, Math.min(multiplier, 1.3));
}

// streak is presently unused, but we will implement streak multipliers in the future
// export function calculateStreakBonus(streak) {
//    return Math.min(1 + streak * 0.05, 2.0);
// }

export function calculateTotalScore(baseScore, incorrectChars, totalChars, timeElapsed, timeLimit, streak = 0) {
    const accuracyMultiplier = calculateAccuracyMultiplier(
        incorrectChars,
        totalChars
    );

    const timeMultiplier = calculateTimeMultiplier(
        timeElapsed,
        timeLimit
    );

    //const streakMultiplier = calculateStreakMultiplier(streak);

    const finalScore =
        baseScore *
        accuracyMultiplier *
        timeMultiplier *
        streakMultiplier;

    return Math.round(Math.max(0, finalScore));
}