import PlantDisplay from "./PlantDisplay.js";
/**
 * The component responsible for displaying the user's current score and accuracy.
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
    constructor(element){
        this.element = element;
    }
    /**
     * Adds a new PlantDisplay to this PlantDisplayGroup.
     */
    addPlant(){
        const plantDisplayMount = document.createElement('div');
        plantDisplayMount.classList.add('plant-display');
        const plantDisplay = new PlantDisplay(plantDisplayMount);
        this.element.appendChild(plantDisplayMount);
        this.plantDisplays.push(plantDisplay);
    }
}
