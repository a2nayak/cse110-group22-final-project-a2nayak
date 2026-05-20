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

/**
 * @typedef {Object} Profile
 * @property {string} name - Display name set by the user
 * @property {string|null} createdAt - ISO timestamp of profile creation
 * @property {number} highScore - All-time high score
 * @property {number} totalGamesPlayed - Total completed games
 * @property {boolean} isInitialized - False = empty slot, true = real profile
 */

/** @returns {Profile} */
export function defaultProfile() {
  return {
    name: "",
    createdAt: null,
    highScore: 0,
    totalGamesPlayed: 0,
    isInitialized: false,
  };
}

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
  set_growth_state(growth_state) {
    this.growth_stage = growth_state;
  }

}

export class Farm {

  constructor(num_plants) {
    this.plants = [];
    this.num_plants = num_plants;
  }

  //function to add a plant to the farm
  add_plant(plant) {
    if (this.plants.length < this.num_plants) {
      this.plants.push(plant);
    }
  }

}

export class Player {
  
  constructor() {
    this.username = "Guest";
    this.score = 0;
    this.level = 1;
    this.num_questions_answered = 0;
    this.language = "";
    this.farm = new Farm(10);
  }

}

/**
 * @typedef {Object} GameState
 * @property {Player} player - The current player object and their farm
 * @property {Array<number>} completed_question_ids - List of answered question IDs
 * @property {number} current_question_id - The ID of the currently active question
 */

/** @returns {GameState} */
export function defaultGameState() {
  return {
    player: new Player(),
    completed_question_ids: [],
    current_question_id: 0,
  };
}