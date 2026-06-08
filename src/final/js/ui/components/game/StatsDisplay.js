/**
 * @module StatsDisplay
 */
/*
 * The component responsible for displaying the user's current score and accuracy.
 * 
 * Expects the following minimal HTML structure:
 * <div class="stats-display">
 *   <p>Score: <span class="stats-display-score"></span></p>
 *   <p>Accuracy: <span class="stats-display-accuracy"></span></p>
 *   <p>CPM: <span class="stats-display-cpm"></span></p>
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
        this.cpmElement = this.element.querySelector('.stats-display-cpm');
    }

    /**
     * Updates the displayed gameplay stats.
     * @param {{ score: number, accuracy: string, cpm: number }} stats
     */
    update(stats) {
        this.scoreElement.textContent = `${stats.score.toString().padStart(6, '0')}`;
        this.accuracyElement.textContent = `${Math.round(stats.accuracy * 100)}%`;
        this.cpmElement.textContent = `${stats.cpm} cpm`;
    }
}
