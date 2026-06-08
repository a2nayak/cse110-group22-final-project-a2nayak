import PlantDisplay from "./PlantDisplay.js";
/**
 * @module PlantDisplayGroup
 */

/**
 * 
 * The component responsible for displaying the user's plants grouped together.
 * 
 * Expects the following minimal HTML structure:
 * <div class="plant-display-group">
 * </div>
 */
export default class PlantDisplayGroup {
    /** @type {PlantDisplay[]} */
    plantDisplays = [];
    /**
     * Binds this PlantDisplayGroup to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.element = element;
    }
    /**
     * Adds a new PlantDisplay to this PlantDisplayGroup.
     */
    addPlant() {
        const plantDisplayMount = document.createElement('div');
        plantDisplayMount.classList.add('plant-display');
        const plantDisplay = new PlantDisplay(plantDisplayMount);
        this.element.appendChild(plantDisplayMount);
        this.plantDisplays.push(plantDisplay);
    }


    /**
     * Removes the last PlantDisplay from this PlantDisplayGroup.
     */
    removePlant(){
        const plantDisplay = this.plantDisplays.pop();
        plantDisplay?.element.remove();
    }

    /**
     * Updates all plant growth stages.
     * @param {number[]} growthLevels
     */
    setGrowthLevels(growthLevels) {
        while (this.plantDisplays.length > growthLevels.length) {
            this.removePlant();
        }

        while (this.plantDisplays.length < growthLevels.length) {
            this.addPlant();
        }

        growthLevels.forEach((growthLevel, index) => {
            this.plantDisplays[index].setGrowthLevel(growthLevel);
        });
    }

    /**
     * Updates plant growth stages.
     * @param {number | number[]} growthLevel
     */
    setGrowthLevel(growthLevel) {
        this.setGrowthLevels(Array.isArray(growthLevel) ? growthLevel : [growthLevel]);
    }
}
