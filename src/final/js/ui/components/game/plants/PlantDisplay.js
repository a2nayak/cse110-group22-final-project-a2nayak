/**
 * @module PlantDisplay
 */

/**
 * The component responsible for displaying the user's current plant level.
 * 
 * Expects the following minimal HTML structure:
 * <div class="plant-display"></div>
 */
export default class PlantDisplay  {
    /** @const {(string)[]} */
    static PLANT_IMAGES = ['plant1-stage1', 'plant1-stage2', 'plant1-stage3'];
    /**
     * Binds this PlantDisplay to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.element = element;
        this.growthLevel = 0;
        this.plantElement = document.createElement('div');

        this.build();
    }

    /**
     * Builds the initial plant image element and appends it to the PlantDisplay element.
     */
    build(){
        this.plantElement.classList.add('plant-image');
        this.plantElement.classList.add(`plant-image-${PlantDisplay.PLANT_IMAGES[this.growthLevel]}`);
        this.element.appendChild(this.plantElement);
    }

    /**
     * Sets the plant's growth stage and updates the rendered image.
     * @param {number} growthLevel
     */
    setGrowthLevel(growthLevel) {
        this.plantElement.classList.remove(`plant-image-${PlantDisplay.PLANT_IMAGES[this.growthLevel]}`);
        this.growthLevel = Math.max(0, Math.min(growthLevel, PlantDisplay.PLANT_IMAGES.length - 1));
        this.plantElement.classList.add(`plant-image-${PlantDisplay.PLANT_IMAGES[this.growthLevel]}`);
    }
}
