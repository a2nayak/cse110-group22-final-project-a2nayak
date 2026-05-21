/**
 * models.js
 *
 * Single source of truth for data shapes used across the game.
 * Defines default structures for Profile and GameState.
 * No logic or storage calls. Shape definitions only.
 * Fields can be added here without requiring behavior changes elsewhere.
 *
 * Imported by:
 * - storage.js: uses defaults when slots are uninitialized
 *
 * Overview: docs/models-overview.md
 */



/*
 * @typedef {Object} GameState
 * @property {number} score - Current game score
 * @property {number} answeredQuestions - Number of questions answered so far
 * @property {Set<number>} usedIndexes - Question indexes already seen this session
 * @property {string|null} savedAt - ISO timestamp of last save, null if no save exists
 * @property {Array} questions - Full question list loaded from JSON (not persisted)
 * @property {Object|null} currentQuestion - The active question object (not persisted)
 * @property {number} totalQuestions - Total number of questions (not persisted)



/** @returns {GameState}
export function defaultGameState() {
  return {
    score: 0,
    answeredQuestions: 0,
    usedIndexes: new Set(), // JSON.stringify() requires Set -> Array conversion. Should be replaced with Array.
    savedAt: null,
    questions: [],
    currentQuestion: null,
    totalQuestions: 0,
  };
}
*/

export class Plant {

  constructor(type,growth_stage) {
    this.type = type;
    this.growth_stage = growth_stage;
  }

  //function to grow the plant by one stage
  grow() {
    if (this.growth_stage < 2) {
      this.growth_stage += 1;
    }
  }

  //function to get the type of the plant
  get_type() {
    return this.type;
  }

  //function to get the growth stage of the plant
  get_growth_stage() {
    return this.growth_stage;
  }

  //function to set the type of the plant
  set_type(type) {
    this.type = type;
  }

  //function to set the growth stage of the plant
  set_growth_stage(growth_stage) {
    this.growth_stage = growth_stage;
  }

}

export class Farm {

  constructor() {
    this.plants = [new Plant("placeholder",0)];
    this.num_plants = 1;
  }

  //function to add a plant to the farm
  plant_seed(plant) {
    if (this.plants.length < this.num_plants) {
      this.plants.push(plant);
    }
  }

  // function to grow all the plants in the farm by one stage
  grow_plants() {
    for (let plant of this.plants) {
      plant.grow();
    }
  }

}

/**
 * @typedef {Object} Player
 * @property {string} username - The player's chosen username
 * @property {number} level - The player's current level
 * @property {number} num_questions_answered - Total questions answered by the player
 * @property {string} language - The player's preferred programming language
 * @property {number} score - The player's total accumulated score
 * @property {boolean} isInitialized - Flag indicating if the profile has been set up
 */
export function defaultPlayer() {
  return {
    username: "Guest",
    score: 0,
    level: 1,
    num_questions_answered: 0,
    language: "Python",
    farm: new Farm(),
  };
}

/**
 * @typedef {Object} GameState
 * @property {Player} player - The current player object and their farm
 * @property {Array<number>} completed_question_ids - List of answered question IDs
 * @property {number} current_question_id - The ID of the currently active question
 * @property {string} current_input - The player's current input for the active question
 */

/** @returns {GameState} */
export function defaultGameState() {
  return {
    player: defaultPlayer(),
    completed_question_ids: [],
    current_question_id: 0,
    current_input: "",
    elapsed_time: 0,
  };
}