/**
 * The component responsible for displaying the user's current score and accuracy.
 * 
 * Expects the following minimal HTML structure:
 * <div class="plant-display"></div>
 */
export default class PlantDisplay  {
    /** @const {(string)[]}*/
    static PLANT_IMAGES = ['plant-small.png', 'plant-medium.png', 'plant-large.png'];
    /**
     * Binds this PlantDisplay to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        this.growthLevel = 0;
        this.plantImageElement = document.createElement('img');

        this.build();
    }
    build(){
        this.plantImageElement.src = PlantDisplay.PLANT_IMAGES[this.growthLevel];
        this.element.appendChild(this.plantImageElement);
    }
}
