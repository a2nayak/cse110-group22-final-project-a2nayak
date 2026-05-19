# storage.js

A localStorage I/O layer for the game. Handles reading and writing profiles and game state.

**File:** `src/prototype/js/storage.js` &nbsp;|&nbsp; **Tests:** `tests/storage.test.js`

---

## Overview

`storage.js` acts as an API between the game engine and the browser's persistent storage. The engine holds its own live copies of profile and state data and calls these functions to read/write them. Ideally, no `localStorage()` calls are required outside of this file.

**Required functions under MVP:**

`profile = loadProfile(id)`
`saveProfile(profile, id)`

These functions can be used to read/write to localStorage after game completion and allow data persistance across sessions.
(id = 0) can be used whenever id is needed for MVP. This means that all data will be read/written to profile_0 in localStorage.

**Optional functions under MVP:**

`initializeProfiles()`
`createProfile(id)`
`clearProfile(id)`

For multi-profile support. Ex. Profile select screen, Respective profile data and storage

`loadState(id)`
`saveState(state, id)`
`clearState(id)`

For state storage and resumption. Ex. Player closes tab -> reopens tab -> resumes state at tab close

`loadActiveProfileId()`
`saveActiveProfileId(id)`

For state storage WITH multi-profile support. Ex. Sets and retrieves last-used profile id for quick profile + state restoration

`clearAll()`

Mostly for testing.

**What this file does:**
- Allows initialization of 4 profile slots on first page load
- Reads and writes profiles and game state to localStorage
- Allows management of which profile slot is currently active

**What this file does not do:**
- Track live game state (`qe.js`)
- Calculate scores or streaks (`scoring.js`)
- Make decisions about game logic

---

## Data Model

Up to 4 profiles and their associated game states are stored in localStorage. Each slot is identified by an id (0–3).

```
localStorage
├── "activeProfile"  →  id
├── "profile_0"      →  { name, createdAt, highScore, totalGamesPlayed, ... }
├── "profile_1"      →  { name, ... }
├── "profile_2"      →  { name, ... }
├── "profile_3"      →  { name, ... }
├── "state_0"        →  { score, answeredQuestions, usedIndexes, savedAt, ... }
├── "state_1"        →  { score, ... }
├── "state_2"        →  { score, ... }
└── "state_3"        →  { score, ... }
```

---

## API Reference

### Profile

#### `loadProfile(id)`
Loads the profile for the given slot. Returns an uninitialized default profile if the slot doesn't exist.
- **Params:** `id` : Profile slot (0–3)
- **Returns:** `Profile`

#### `saveProfile(profile, id)`
Writes a profile object to localStorage at the given slot.
- **Params:** `profile` : A `Profile` object, `id` : Profile slot (0–3)
- **Returns:** `boolean` : `true` if saved successfully, `false` on failure (e.g. storage full)

#### `loadActiveProfileId()`
Returns the id of the last selected profile slot, or `null` if none has been selected.
- **Returns:** `number | null`

#### `saveActiveProfileId(id)`
Saves the currently selected profile slot id. Call this when the user selects a profile on the profile select screen.
- **Params:** `id` : Profile slot (0–3)

#### `initializeProfiles()`
Writes all 4 profile slots to localStorage with default uninitialized values, if they don't already exist. Should be called once on every page load before any other storage functions.

#### `createProfile(id)`
Creates a new initialized profile at the given slot, saves it, and returns it. Sets `isInitialized: true` and `createdAt` automatically. The engine should then prompt the user for a name and call `saveProfile`.
- **Params:** `id` : Profile slot (0–3)
- **Returns:** `Profile`

#### `clearProfile(id)`
Resets a profile slot back to its uninitialized default and clears the associated game state. Use this when the user deletes their profile.
- **Params:** `id` : Profile slot (0–3)

---

### Game State

#### `loadState(id)`
Loads the game state for the given slot. Returns a fresh default state (with `savedAt: null`) if none exists.
- **Params:** `id` : Profile slot (0–3)
- **Returns:** `GameState`

#### `saveState(state, id)`
Writes the game state to localStorage. Strips fields (`questions`, `currentQuestion`, `totalQuestions`) and converts `usedIndexes` from Set to Array automatically. Sets `savedAt` to the current timestamp.
- **Params:** `state` : The engine's state object, `id` : Profile slot (0–3)
- **Returns:** `boolean` : `true` if saved successfully, `false` on failure

#### `clearState(id)`
Removes game state for the given slot. The next `loadState(id)` call will return a fresh default with `savedAt: null`.
- **Params:** `id` : Profile slot (0–3)

---

### Nuclear Options

#### `clearAll()`
Removes all profiles, game states, and the active profile id from localStorage. Use for a full reset.

---

## Usage Examples

### Page load (MVP)

```js
import { loadProfile } from './storage.js';

const profile = loadProfile(0); // id = 0
```

### Page load (with state resumption)

```js
import { loadProfile, loadState } from './storage.js';

const profile = loadProfile(0); // id = 0
const state = loadState(0);
state.usedIndexes = new Set(state.usedIndexes); // Needed with Set implementation

// questions, currentQuestion, totalQuestions are null after load and must be re-derived from JSON
const response = await fetch('../data/questions.json');
state.questions = await response.json();
state.totalQuestions = state.questions.length;
state.currentQuestion = state.questions.find((q, i) => !state.usedIndexes.has(i)) ?? null;
```

### Saving state after each question

```js
import { loadState, saveState } from './storage.js';

state = loadState(0); // id = 0
while () { // Game loop
    // Game step
    saveState(state, 0); 
}

```

### End of game (MVP)

```js
import { loadProfile, saveProfile } from './storage.js';

const profile = loadProfile(0); // id = 0
// Game session
profile.highScore = Math.max(profile.highScore, state.score);
profile.totalGamesPlayed++;
saveProfile(profile, 0);
```

---

## Changelog

| Date | Sprint | Description |
|---|---|---|
| 5/18/2026 | 2 | Renamed PlayerProfile → Profile, renamed loadPlayer → loadProfile etc., added models.js dependency |
| 5/17/2026 | 2 | Initial draft |
