# Sprint 3: Final Architecture of Typing Game MVP

## Core Gameplay Loop

1. `ui.js` requests the current question from `question.js`
2. `ui.js` renders the question and tracks typing metrics
3. `ui.js` creates a `QuestionResult` object after question completion
4. `ui.js` passes `QuestionResult` into `game.js`
5. `game.js` calls relevant systems functions to update `gameState`
6. Systems functions mutate/update `gameState`
7. `game.js` saves updated `gameState` using `save.js`
8. `game.js` returns updated references/flags needed for rerendering
9. `ui.js` rerenders the DOM using updated `gameState`
10. Loop repeats

**Note:**  
We decided against a backend/API architecture for the MVP. Instead, the frontend and gameplay systems will communicate through a shared `gameState` object and centralized controller functions in `game.js`.

---

# Architecture Overview

## Team 2: UI/UX

- Create a basic farm backdrop with 3-5 planting plots
- Create 1 plant with 4 different states
  - Empty
  - Seedling
  - Growing
  - Mature
- Create page structure and layout with boxes to display the question and a user input box with the answer to the question written in ghost text
- Create the submit button that triggers the gameplay logic

## ui.js

### Goal

Handles:
- DOM manipulation
- rendering
- event listeners
- keyboard input
- collecting typing metrics
- rerendering updated UI

### Important Rule

`ui.js` should:
- READ from `gameState`
- NEVER directly mutate progression-related game state

### Workflow:

At this point, you have access to a shared `gameState` object that contains information about:
- player level
- selected language
- current score
- current question
- farm state
- completed questions

With this, you must
- Display the current question
- Display ghost text of the correct answer
- Begin timer
- Track the current typed character and compare it with the expected character
  - If it is incorrect, increment a counter
- Pass typing results into `GameState.updateGame(player, result)`
- Create this object and fill it with collected information:

```js
QuestionResult {
    questionID      // from JSON
    timeElapsed
    incorrectChars
    totalChars
}
```

- Await response from `GameState`
  - Backend will send an updated `GameState` that will then have to be processed for changes in UI
- Update UI
  - Update the graphics to render the `GameState` changes in the garden and the plant

---
## Team 3: Backend

## game.js

### Goal: Acts as the central controller for the game loop.

`game.js` determines:
- what systems functions run
- when `gameState` updates occur
- when save/load operations occur
- what data is returned to `ui.js`

### Responsibilities

- Call scoring functions
- Call progression functions
- Call farm update functions
- Trigger `saveGame()`
- Return updated references/flags needed for rerendering

### Main Function

```js
updateGame(state, QuestionResult)
```

### Returns

```txt
updated gameState

optional UI event flags:
- levelUp
- plantGrowth
- addPlant
```

Flags are only used for:
- animations
- notifications
- temporary UI effects

Actual rendering should always come from updated `gameState`.

---

## models.js

### Goal

Stores:
- initial `gameState` structure
- lightweight data models/classes
- default constructors

Classes should primarily store related data and lightweight behavior.

Heavy gameplay logic should remain in `systems/*.js`.

---

## systems/*.js

### Goal

Each systems file contains isolated gameplay logic/functions that are called by `game.js`.

Systems functions are responsible for mutating/updating `gameState`.

---



##### Game Loop Integration

- Pass `QuestionResult` into `game.js` update functions
- Receive updated `gameState` references/flags from `game.js`
- Rerender UI using updated `gameState`

---

##### UI Updates

Use updated `gameState` to rerender:
- farm graphics
- plant growth stages
- score display
- level display
- current question
- progression-related UI

Optional UI event flags may also be used for:
- growth animations
- level-up notifications
- temporary effects


---

# GameState Object Structure

```txt
Player player
List completed_question_ids
int current_question_id

```

---

# PLAYER CLASS

## Constructor

Create a default player object with placeholder values.

Customizable player setup and onboarding flow will be implemented in a later sprint.

---

## Attributes

```txt
string username
int score
int level
int num_questions_answered
string language
Farm farm
```

---

# FARM CLASS

## Attributes

```txt
List plants
int num_plants
```

---

# PLANT CLASS

## Attributes

```txt
string type
int growth_stage
```

---

## Growth Stages

```txt
0 = seedling
1 = growing
2 = mature
```

---

# systems/*.js

## scoring.js

Handles:
- score calculation
- accuracy calculation
- time bonus calculations

---

## timer.js

Handles:
- timer start/reset/end logic
- elapsed time tracking

---

## farm.js

### plantSeed()

- Creates and adds `Plant` object to player farm

### growPlants()

- Calls `grow()` on all plants

---

## progression.js

### checkLevelUp()

Determines if player level should increase.

### checkPlantGrowth()

Determines if plant growth milestones are reached.

---

## save.js

### saveGame()

- Serializes `gameState`
- Stores it in `localStorage`

### loadGame()

- Loads serialized `gameState` from `localStorage`
- If no save exists, creates a default `gameState`

---

## question.js

Handles:
- question selection
- loading questions from JSON
- returning current question object

---

# Progression Rules

```txt
Every 3 completed questions:
- grow all plants
- set plantGrowth = true

Every 9 completed questions:
- increment player level
- set levelUp = true
```

---

# Important Design Rule

`gameState` is the single source of truth for the game.

`ui.js` should never directly modify progression-related data such as:
- score
- level
- plants
- save data

All progression updates should occur through `game.js` and `systems/*.js`.


# Core Flow - Summary

## UI Prompts

- Use `question.js` to generate and display a question
- Prompt user for answer
- Track relevant user information
- Bundle in QuestionResult object

## Game Loop Integration

- Pass `QuestionResult` into `game.js` `updateGame()` function
- Save updated `gameState` references/flags in `game.js`
- Rerender UI using updated `gameState` and aforementioned references/flags

---

## UI Updates

Use updated `gameState` to rerender:
- farm graphics
- plant growth stages
- score display
- level display
- current question
- progression-related UI

Optional UI event flags may also be used for:
- growth animations
- level-up notifications
- temporary effects