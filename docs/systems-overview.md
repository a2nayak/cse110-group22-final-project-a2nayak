# Systems Overview

## game.js

### High-Level Responsibility:
Acts as the central orchestrator for the typing game, managing the game lifecycle, player input, state transitions between rounds, and coordinating communication between the UI, storage, timer, and scoring modules.

### Function Breakdowns:
* **`initializeGame(uiCallbacks)`**: Establishes the communication bridge with the UI layer, enabling the game controller to trigger page updates.
* **`startLevel(levelNumber, category)`**: Initializes a new level by loading data, resetting runtime metadata, rendering the initial gameplay screen, and starting the game timer.
* **`handleRoundComplete()`**: Calculates the score for the completed question, updates total game progress, selects the next question, or terminates the game if no questions remain.
* **`endGame()`**: Halts gameplay, stops the timer, saves the current game progress to storage, and directs the UI to load the end-of-game screen.
* **`onTick(timeRemaining)`**: Callback function that updates the UI timer display during active gameplay.
* **`handleExpire()`**: Manages the logic when a timer expires, either transitioning to the next question or triggering game completion.
* **`onInput(key)`**: Processes user keyboard input, validates keystrokes against the current question, updates character accuracy stats, and detects when a round is successfully completed.
* **`buildSaveSnapshot()`**: Generates an object containing essential state data (score, progress, category) for serialization to local storage.

## level.js

### High-Level Responsibility:
Handles the retrieval and structure of game level data.

### Function Breakdowns:
* **`loadLevel(levelNumber, category)`**: Responsible for fetching the definitions and content required for a specific level based on its number and chosen category.

## questions.js

### High-Level Responsibility:
Manages the logic for question selection and progression throughout a game session.

### Function Breakdowns:
* **`getNextQuestion()`**: Retrieves the next question in the sequence for the current level.

## scoring.js

### High-Level Responsibility:
Encapsulates the mathematical logic for calculating player performance.

### Function Breakdowns:
* **`calculateTotalScore(...)`**: Computes the score for a single question based on factors such as base score, accuracy (incorrect characters), answer length, and time taken.

## storage.js

### High-Level Responsibility:
Handles data persistence, allowing game state and user profiles to be saved and retrieved.

### Function Breakdowns:
* **`loadProfile()`**: Retrieves player profile data.
* **`saveProfile(profile)`**: Persists player profile data.
* **`loadState()`**: Restores a previously saved game session state.
* **`saveState(state)`**: Saves the current game session state.
* **`saveAll()`**: Persists all current game and profile data to storage.

## timer.js

### High-Level Responsibility:
Manages timing mechanisms for game sessions, including start, stop, and expiration logic.

### Function Breakdowns:
* **`startTimer(duration, onTick, onExpire)`**: Initializes and starts a timer with defined duration and callback hooks for ticks and expiration.
* **`stopTimer()`**: Immediately halts the active timer.