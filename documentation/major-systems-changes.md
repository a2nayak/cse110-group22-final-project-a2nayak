# Backend Infastructure Refactor ADR

## Context:

After a large nuclear rewrite to our codebase, there were several logic gaps and cohesion gaps with frontend to be filled. The following document illustrates what was changed and what was preserved in this process.

# New Variables

The new variables `isActive` and `isPaused` were added as flags used to saftey check functions

## Previous Design

Previously, functions were able to be called under any conditions in the game state, which can lead to issues if a function is mistakenly called while a session is supposed to be inactive.

## New Design

These flags check for if there is currently an active session and if the session is paused in order to safely execute functions only when they are able to be called.

# Communication Architecture

## Preserved Design

The callback-based architecture was retained.

### UI → Backend

```js
gameUI.codeInputField.onKeyPress(glue.handleKeyPress);
```

↓

```js
onInput(key)
```

### Backend → UI

```js
callbacks.loadScreen(...)
callbacks.updateScreen(...)
```

This architecture remains valid and scalable.

---

# Input Validation Refactor

## Original Input Model

The original implementation lacked many checks for the conditions of the game such as where to send players after a level up, when to level up plants, and how to handle non-ASCII keystrokes. 

---

## New Input Model

The backend validates correctness per keystroke and conditionally adapts to the game.

### New Behavior

For each keypress:

* backend checks only the newest character
* backend determines correctness immediately
* backend appends correct characters to canonical state

For level-up behavior, `handleQuestionComplete()` was added.

### Result

```js
const i = state.current_input.length;
const expectedChar = answer[i];

if (key === expectedChar) {
    state.current_input += key;
}
```

### Benefits

* Backend remains source of truth
* UI does not manage correctness logic
* Reduced synchronization risk
* Cleaner combo/scoring hooks
* Input correctly handles neccesary state changes

---

# Timer System Refactor

## Original Timer System

The original timer architecture used:

```js
setInterval(...)
```

with:

* mutable countdown state
* decrementing seconds
* backend tick events every second

### Old Flow

```text
interval tick
    ↓
mutate state.timer
    ↓
emit "tick"
    ↓
frontend updates display
```

---

## Problems With Original Design

### Drift

`setInterval()` is not perfectly precise.

### Duplicate Interval Risk

Multiple intervals could accidentally exist simultaneously.

### Synchronization Problems

Frontend display depended on backend tick cadence.

### Pause/Resume Complexity

Timer state mutation became fragile.

### Backend Spam

Backend emitted unnecessary updates every second.

---

# New Timer Architecture

## Core Design Change

The backend no longer tracks countdown values.

Instead, the backend tracks:

```js
state.question_start_time
state.end_time
```

The frontend computes remaining time locally.

---

# New Timer Module

## Old Design

```js
setInterval(...)
```

## New Design

```js
setTimeout(...)
```

### New Responsibility

The timer module now only answers:

```text
"When should expiration occur?"
```

---

# New `timer.js`

## Removed

```js
timeRemaining
_onTick()
tick events
```

## Added

```js
startTimer(endTime, onExpire)
```

### Logic

```js
const remainingMs = endTime - Date.now();

setTimeout(onExpire, remainingMs);
```

---

# Frontend Timer Rendering

The frontend now computes remaining time itself.

### Formula

```js
remainingMs = state.end_time - Date.now();
```

This removes the need for backend tick events entirely.

---

# Question Lifecycle Timing

## New Timing Fields

Added to state:

```js
question_start_time
end_time
remaining_on_pause
```

---

# Question Start

Whenever a question begins:

```js
state.question_start_time = Date.now();

state.end_time =
    state.question_start_time +
    state.time_limit_ms;
```

---

# Pause Logic

## On Pause

```js
state.remaining_on_pause =
    state.end_time - Date.now();
```

Timer is stopped.

---

## On Resume

```js
state.end_time =
    Date.now() + state.remaining_on_pause;
```

Timer restarts using the recomputed end time.

---

# New Helper Function

Added:

```js
startQuestionTimer()
```

Responsibilities:

* stop existing timer
* store question start timestamp
* compute end timestamp
* start expiration timeout

This helper is called:

* when level starts
* after each completed question

---

# Scoring Refactor

## Original Timing Dependency

Old scoring depended on:

```js
time_limit - timer
```

This relied on decrement-based timer state.

---

# New Timing Dependency

Scoring now uses elapsed real time:

```js
const elapsedMs =
    Date.now() - state.question_start_time;
```

---

# Updated Scoring Signature

## Old

```js
calculateTotalScore(baseScore, state)
```

## New

```js
calculateTotalScore(baseScore, state, elapsedMs)
```

This removes scoring dependence on timer state mutation.

---

# Time Unit Standardization

## Old

```js
timeLimit: 60
```

(seconds)

## New

```js
timeLimitMs: 60000
```

(milliseconds)

---

# Reason For Standardization

All timing APIs already use milliseconds:

* `Date.now()`
* `setTimeout()`

Using milliseconds internally:

* reduces conversion bugs
* simplifies math
* improves consistency

Frontend converts to seconds only for display.

---

# `level.js` Refactor

## Removed

```js
timer
```

from returned state.

The backend no longer stores mutable countdown values.

---

## Added Timing Fields

```js
question_start_time: null
end_time: null
remaining_on_pause: null
```

---

## Fetch Cleanup

Removed duplicate fetch call:

```js
fetch(...)
```

that was unused.

---

## Added Fetch Error Handling

```js
if (!response.ok) {
    throw new Error(...);
}
```

---

# Plant Growth Fix

## Original Bug

```js
if(state.questions.length % 3 === 0)
```

This checked total question count.

---

## Correct Logic

```js
if(state.current_question_index % 3 === 0)
```

Plant growth should depend on progression, not total length.

---

# Part 2: Major Refactor of Scoring System

---

# Scoring Fix

## Previous Logic

Previously, time and accuracy score multipliers would only applied once to the score at the end of the game.
This was incorrect as only the last question would be scaled and added to the current player's score, which is
not what our MVP aimed for. We aimed for a responsive scoring system that showed players live rewards for high accuracy and speed

## Current Logic

Scoring has now been updated to reflect the critera of the MVP, now calculating and appending total score in `handleQuestionComplete()` in order to reflect accurate scores after every question. 

# `level.js` JSON Alignment Refactor

## Context

Following the backend rewrite, several inconsistencies existed between the level initialization logic and the question JSON schema. In particular, variable naming and score handling did not accurately reflect the structure and intent of the question data.

## Changes

### JSON Field Alignment

`level.js` was updated to properly align with the question JSON files.

This included:

* updating variable names to match the JSON schema
* clarifying the purpose of `base_score`
* removing ambiguity between level configuration data and runtime scoring data

### Base Score Tracking

Added:

```js
base_scores
```

to state.

This array stores the per-question `base_score` values defined in the question JSON files.

### Benefits

* Better agreement between backend state and question definitions
* Clear separation between question metadata and runtime score calculations
* Improved support for future analytics and score breakdown features

---

# Player State Persistence Refactor

## Previous Design

Player persistence occurred only inside:

```js
endGame()
```

Only a limited subset of state was preserved:

```js
score
current_question_index
```

This created ambiguity around what data should persist and when persistence should occur.

---

## New Design

Added:

```js
savePlayerState()
```

### Responsibilities

Persist the current:

```js
score
current_level
current_question_index
```

to the player profile.

### Benefits

* Centralized persistence logic
* Eliminates duplicated save behavior
* Allows state to be saved at any point in gameplay

Examples include:

* after a question
* after a level
* during pause/resume
* during future autosave implementations

This improves both current maintainability and future extensibility.

---

# Game Flow Refactor

## `endGame()` Clarification

### Previous Design

`endGame()` handled two unrelated responsibilities:

* ending the entire game
* transitioning between levels

This created ambiguity because the frontend requires different screens and callbacks for these situations.

### New Design

The scope of `endGame()` has been narrowed.

`endGame()` is now responsible only for:

```text
Terminating the current game session
```

This makes the function behavior explicit and easier for the UI layer to reason about.

---

## Added `goToNextLevel()`

Created:

```js
goToNextLevel()
```

### Responsibilities

* persist current player progress
* advance level state
* initialize the next level
* invoke the correct frontend transition callbacks

### Benefits

* Separates level progression from game termination
* Improves frontend/backend cohesion
* Reduces conditional logic surrounding screen transitions
* Better reflects actual gameplay behavior

---

## Removed `goToLevelSelect()`

### Context

Based on current discussions with Team 2, the application is no longer moving toward a dedicated level-selection screen.

Instead, progression flows through a level-results screen before advancing to the next level.

### Changes

Removed:

```js
goToLevelSelect()
```

Level transitions are now handled by:

```js
goToNextLevel()
```

which more accurately represents the current product direction.

---

# Scoring Architecture Refactor

## Previous Design

Previously, score accumulation worked as follows:

For each correctly completed question:

```js
score += baseScore
```

At the end of the game, score multipliers were applied once:

```js
calculateTotalScore(...)
```

### Problem

The backend did not preserve per-question timing and accuracy information between questions.

As a result, the final multiplier calculation only reflected the timing and accuracy data from the most recently completed question.

This meant that:

* earlier performance was ignored
* final scores were inaccurate
* live score feedback did not match actual player performance

---

## New Design

`base_score` now strictly represents the value defined by the question JSON files.

Rather than treating base score as the primary source of truth for total score, score multipliers are now calculated immediately when a question is completed.

### New Flow

Inside:

```js
handleQuestionComplete()
```

the backend now:

1. retrieves the question's `base_score`
2. calculates applicable accuracy and speed multipliers
3. computes the fully adjusted score
4. immediately appends that value to:

```js
state.score
```

### Benefits

* Accurate per-question score calculation
* Correct application of timing and accuracy multipliers
* Live score updates throughout gameplay
* Eliminates dependence on end-of-game score reconstruction
* Aligns implementation with MVP scoring requirements

The backend score now always reflects the player's true cumulative score at any point during gameplay.


# Remaining Future Improvements

Potential future improvements:

* replace biased array shuffle implementation
* migrate glue callbacks to event objects or reducer-style updates later if needed

These are cleanup/scalability improvements rather than immediate correctness fixes.
