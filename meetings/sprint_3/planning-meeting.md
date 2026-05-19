## Sprint 3 Planning Meeting

Members Attended: Angel, Dmitri, Anirudh, Lucien, Sean, Ben, Yannis, Sirtaj    

Members Absent: Sofia, Brenda, Kaung (all communicated)

## Sprint Goals: Solidify Core Game Logic

## Core Gameplay Loop

1. QuestionManager selects a question from the JSON database
2. Frontend renders the question and tracks typing metrics
3. Frontend creates a QuestionResult object
4. QuestionResult is passed into `GameState.updateGame()`
5. GameState updates the player, farm, plants, and score
6. GameState saves updated data to localStorage
7. Updated GameState is returned to the frontend
8. Frontend rerenders the farm and UI using the updated GameState
9. Loop repeats

**Note:** We talked about the connection between the frontend and backend being via API-like calls or through callback functions, but passing objects back and forth is an easier goal for the MVP and this sprint.

---

# Team 2

## Main Goal

Create basic assets and create the user engagement functionality.

## Tasks

### Asset Development

- Create the farm backdrop with 3–5 plots in a map
- Create plant assets (only for one plant)
  - Empty
  - Planted seedling
  - Growing
  - Mature

### Render Questions

#### What do you have?

At this point, you have a `GameState` object that contains information about the player like:
- what level they are on
- what language their save is in
- their current score
- the current question
- their farm state
- etc.

#### What needs to be done?

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

# Team 3

## Main Goal

Create the relevant objects and cycle needed to store the `GameState`.

## PLAYER CLASS

### Constructor

Create a default with arbitrary values that will be filled with customizable player info down the line.

### Attributes

```txt
string username
int score
int level
int num_questions_answered
string language
Object farm
```

### Functionality

- Getters and setters for each attribute

---

## FARM CLASS

### Constructor

### Attributes

```txt
List plants
int num_plants
```

### Functionality

#### Getter and setter for `num_plants`

#### `plant_seed(plants)`

- Create plant object
- Add to plants array
- Increment `num_plants`

#### `grow_plants(plants)`

- Iterate through plants and call `grow()` function

---

## PLANT CLASS

### Attributes

```txt
String type
Int level (0 = seedling, 1 = growing, 2 = mature)
```

### Functionality

#### Getters and setters

- Getter and setter for `type`
- Getter and setter for `level`

#### `grow()`

- Increases level of plant if `level < 2`

---

## GAMESTATE CLASS

### Attributes

```txt
Player player
List completed_question_ids
boolean levelUp
boolean plantGrowth
boolean addPlant
int current_question_id
```

### Functionality

#### `questionManager()`

- Adds 1 to `current_question_id` and returns the value

**Note:** This is to be changed into a semi-random question picker down the line. For now it is just going to increment the question we are on and return it so the frontend knows which question to display.

---

#### `loadGame()`

- Either reconstructs player from `localStorage` or creates a new `Player`

**Note:**  
The creation of a new `Player` is currently undetermined and will probably be implemented next sprint. For now, call the default constructor of `Player`.

---

#### `saveGame()`

- Serializes `GameState` and stores it in `localStorage`
- To be called after every completed question

---

#### `updateGame(player, frontend_results)`

- Call functions to compute score
- Increment `num_questions_answered` in `player`
- Add `questionID` to `completed_question_ids`

```txt
If num_questions_answered % 9 == 0:
    level++
    set levelUp = true

If num_questions_answered % 3 == 0:
    grow_plants(player.farm)
    set plantGrowth = true
```

- Trigger plant growth
- Save game
- Return updated `GameState`