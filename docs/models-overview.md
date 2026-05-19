# models.js

The single source of truth for data shapes used across the game. Defines default structures for `Profile` and `GameState`.

**File:** `src/prototype/js/models.js`

---

## Overview

`models.js` defines the shape of the two core data objects used throughout the game: `Profile` and `GameState`. It contains no logic, no storage calls, and no dependencies. All other files that create or manipulate these objects import from here.

Fields can be added to either shape without requiring behavior changes elsewhere. Files can read whatever fields are present on the object.

Plain object implementation over classes was chosen to keep data and behavior cleanly seperated.
Only the engine should be writing to this object so encapsulation probably isn't needed. Also makes it so we don't have to write getters and setters for every element.

**What this file does:**
- Defines the `Profile` data shape and its defaults
- Defines the `GameState` data shape and its defaults
- Exports factory functions that return a fresh default instance of each

**What this file does not do:**
- Read or write to localStorage (`storage.js`)
- Track live game state (`qe.js`)
- Calculate scores or streaks (`scoring.js`)

---

## Data Model

### Profile shape

| Field | Type | Description |
|---|---|---|
| `name` | string | Display name set by the user |
| `createdAt` | string \| null | ISO timestamp of profile creation |
| `highScore` | number | All-time high score |
| `totalGamesPlayed` | number | Total completed games |
| `isInitialized` | boolean | False = empty slot, True = real profile |

### GameState shape

| Field | Type | Persisted | Description |
|---|---|---|---|
| `score` | number | Yes | Current game score |
| `answeredQuestions` | number | Yes | Number of questions answered so far |
| `usedIndexes` | Set\<number\> | Yes (as Array) | Question indexes already seen this session |
| `savedAt` | string \| null | Yes | ISO timestamp of last save. `null` means no save exists |
| `questions` | Array | No | Full question list loaded from JSON |
| `currentQuestion` | Object \| null | No | The active question object |
| `totalQuestions` | number | No | Total number of questions |

> **Note:** `questions`, `currentQuestion`, and `totalQuestions` are runtime-only. `storage.js` sets them to `null` on save and they must be re-derived by the engine after loading. `usedIndexes` is a `Set` at runtime but is converted to an `Array` for JSON serialization and must be restored to a `Set` in the engine after loading.

---

## API Reference

#### `defaultProfile()`
Returns a fresh `Profile` object with default uninitialized values.
- **Returns:** `Profile`

#### `defaultGameState()`
Returns a fresh `GameState` object with default values.
- **Returns:** `GameState`

---

## Usage Examples

### Initializing live objects in the engine

```js
import { defaultProfile, defaultGameState } from './models.js';

const profile = defaultProfile();   // engine's live profile copy
const state = defaultGameState();   // engine's live state copy
```

### Adding a new field

To add a field (e.g. `streak` to `GameState`), update `defaultGameState()` here:

```js
export function defaultGameState() {
  return {
    score: 0,
    answeredQuestions: 0,
    usedIndexes: new Set(),
    savedAt: null,
    questions: [],
    currentQuestion: null,
    totalQuestions: 0,
    streak: 0,           // new field
  };
}
```

No other files need to change unless they specifically use `streak`.

---

## Changelog

| Date | Sprint | Description |
|---|---|---|
| 5/18/2026 | 2 | Initial draft |
