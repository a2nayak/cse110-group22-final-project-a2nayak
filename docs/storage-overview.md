# storage.js

A localStorage I/O layer for the game. Handles reading and writing player profiles and game state. 

Version 1.0 : 5/17/2026
Sprint 2

Overview: docs/storage-overview.md
File: src/prototype/js/storage.js
Tests: tests/storage.test.js

---

## Overview

`storage.js` acts as an API between the game engine and the browser's persistent storage. The engine holds its own live copies of player and state data and calls these functions to read/write them. Ideally, no `localStorage()` calls are required outside of this file.

Usage:

`player = loadPlayer(id = 0)`
`savePlayer(playerData, id = 0)`

Is all that is required under our MVP description. These functions can be used to read/write to localStorage after game completion. 
`PlayerProfile player` object shape can be changed as more data variables are implemented (See below)
`GameState` data and related functions are for possible future persistant game state implementations (Ex. closed tab -> open page -> game continues)
IDs are for possible implementation of multiple player profiles, for now [id = 0] can be used wherever id is required. (Writes/reads at player_0 in localStorage)

**What this file does:**
- Allows initialization of 4 profile slots on first page load
- Reads and writes player profiles and game state to localStorage
- Allows management of which profile slot is currently active

**What this file does not do:**
- Track live game state (`qe.js`)
- Calculate scores or streaks (`scoring.js`)
- Make decisions about game logic

---

## Data Model

Up to 4 player profiles and their associated game states are stored in localStorage. Each slot is identified by an id (0–3).

```
localStorage
├── "activeProfile"  →  id
├── "player_0"       →  { name, highScore, ... }
├── "player_1"       →  { name, highScore, ... }
├── "player_2"       →  { name, highScore, ... }
├── "player_3"       →  { name, highScore, ... }
├── "state_0"        →  { score, answeredQuestions, usedIndexes, savedAt }
├── "state_1"        →  { score, ... }
├── "state_2"        →  { score, ... }
└── "state_3"        →  { score, ... }
```

### PlayerProfile shape

| Field | Type | Description |
|---|---|---|
| `name` | string | Display name set by the user |
| `createdAt` | string \| null | ISO timestamp of profile creation |
| `highScore` | number | All-time high score |
| `totalGamesPlayed` | number | Total completed games |
| `isInitialized` | boolean | False = empty slot, True = real profile |

### GameState shape

| Field | Type | Description |
|---|---|---|
| `score` | number | Current game score |
| `answeredQuestions` | number | Number of questions answered so far |
| `usedIndexes` | Array | Question indexes already seen this session (stored as Array; restore to Set in engine) |
| `savedAt` | string \| null | ISO timestamp of last save — `null` means no save exists, non-null means there is a mid-game state to resume |

> **Note:** `questions`, `currentQuestion`, and `totalQuestions` are always stored as `null` and must be re-derived by the engine after loading (reload questions from JSON, then derive `currentQuestion` and `totalQuestions` from that).

---

## API Reference

### Active Profile

#### `loadActiveProfileId()`
Returns the id of the last selected profile slot, or `null` if none has been selected.
- **Returns:** `number | null`

#### `saveActiveProfileId(id)`
Saves the currently selected profile slot id. Call this when the user selects a profile on the profile select screen.
- **Params:** `id` — Profile slot (0–3)

---

### Profile Initialization

#### `initializeProfiles()`
Writes all 4 profile slots to localStorage with default uninitialized values, if they don't already exist. Should be called once on every page load before any other storage functions.

---
### Player Profile

#### `loadPlayer(id)`
Loads the player profile for the given slot. Returns an uninitialized default profile if the slot doesn't exist.
- **Params:** `id` : Profile slot (0–3)
- **Returns:** `PlayerProfile`

#### `createPlayer(id)`
Creates a new initialized player profile at the given slot, saves it, and returns it. Sets `isInitialized: true` and `createdAt` automatically. The engine should then prompt the user for a name and call `savePlayer`.
- **Params:** `id` : Profile slot (0–3)
- **Returns:** `PlayerProfile`

#### `savePlayer(playerData, id)`
Writes a player profile object to localStorage at the given slot.
- **Params:** `playerData` : A `PlayerProfile` object, `id` : Profile slot (0–3)
- **Returns:** `boolean` : `true` if saved successfully, `false` on failure (e.g. storage full)

#### `clearPlayer(id)`
Resets a profile slot back to its uninitialized default and clears the associated game state. Use this when the user deletes their profile.
- **Params:** `id` — Profile slot (0–3)

---

### Game State

#### `loadState(id)`
Loads the game state for the given slot. Returns a fresh default state (with `savedAt: null`) if none exists.
- **Params:** `id` — Profile slot (0–3)
- **Returns:** `GameState`

#### `saveState(state, id)`
Writes the game state to localStorage. Strips fields (`questions`, `currentQuestion`, `totalQuestions`) and converts `usedIndexes` from Set to Array automatically. Sets `savedAt` to the current timestamp.
- **Params:** `state` — The engine's state object, `id` : Profile slot (0–3)
- **Returns:** `boolean` : `true` if saved successfully, `false` on failure

#### `clearState(id)`
Removes game state for the given slot. The next `loadState(id)` call will return a fresh default with `savedAt: null`.
- **Params:** `id` : Profile slot (0–3)

---

### Nuclear Options

#### `clearAll()`
Removes all player profiles, game states, and the active profile id from localStorage. Use for a full reset.

---

## Usage Examples

### Page load

```js
import { initializeProfiles, loadActiveProfileId, loadPlayer, loadState } from './storage.js';

// Call first to ensure all 4 player slots exist
// Not necessary unless profile viewing interface is added
initializeProfiles();

// Load player 0 user profile
const player = loadPlayer(0);

// Load fresh player 0 state data
// Not necessary unless peristant game states are implemented
const state = loadState(0); 
state.score = saved.score;
state.answeredQuestions = saved.answeredQuestions;
state.usedIndexes = new Set(saved.usedIndexes); // Ideally switch from set -> array implementation
// Reload questions from JSON, then resume

```

### Saving state after each question

```js
import { saveState } from './storage.js';

// Pass the engine's state object directly — saveState handles Set→Array and savedAt
// Not necessary unless peristant game states are implemented
saveState(state, activeProfileId); // ideally switch from set -> array implementation
```

### End of game

```js
import { savePlayer, clearState } from './storage.js';

// update player profile stats
player.highScore = Math.max(player.highScore, state.score);
player.totalGamesPlayed++;
savePlayer(player, activeProfileId);

```

### User deletes profile

```js
import { clearPlayer, saveActiveProfileId } from './storage.js';

clearPlayer(slotId);          // resets slot and clears state

```

---

## Future Work

- Add `streak`, `timerRecords`, and `timerSettings` to `GameState` once `scoring.js` and `timer.js` are wired into `qe.js`
- Add additional fields to `PlayerProfile` as features are fleshed out (e.g. language preference, difficulty setting)
- Consider server-side storage for cross-device profile access (probably not)
