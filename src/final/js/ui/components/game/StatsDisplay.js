
/**
 * The component responsible for displaying the user's current score and accuracy.
 * 
 * Expects the following minimal HTML structure:
 * <div class="stats-display">
 *   <p>Score: <span class="stats-display-score"></span></p>
 *   <p>Accuracy: <span class="stats-display-accuracy"></span></p>
 *   <p>WPM: <span class="stats-display-wpm"></span></p>
 * </div>
 */
export default class StatsDisplay {
    
    /**
     * Binds this StatsDisplay to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        this.scoreElement = this.element.querySelector('.stats-display-score');
        this.accuracyElement = this.element.querySelector('.stats-display-accuracy');
        this.wpmElement = this.element.querySelector('.stats-display-wpm');
    }
}
