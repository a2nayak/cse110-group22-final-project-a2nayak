/**
 * plants.js
 *
 * Utility functions for the plant/farm system.
 * Takes the plants array from models.js Farm and returns updated state.
 * Does not mutate the array directly — returns a new array.
 *
 * Imported by:
 * - game.js: calls growNextPlant() on each correct answer
 */

/**
 * Grows the leftmost plant that hasn't reached max stage (3).
 * If plant[0] is at 3, tries plant[1], and so on.
 * Returns a new plants array with the updated growth stage.
 * If all plants are already at max, the array is returned unchanged.
 *
 * @param {import('../models/models.js').Plant[]} plants
 * @returns {import('../models/models.js').Plant[]}
 */
export function growNextPlant(state) {
  let plants = state.plants;
  for (let i = 0; i < plants.length; i++) {
    if (plants[i] < 3) {
      plants[i]++;
      break;
    }
  }
  return plants;
}
