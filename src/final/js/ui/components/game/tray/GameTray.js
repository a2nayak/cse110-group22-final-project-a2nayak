/**
 * The component responsible for displaying the game tray.
 * 
 * Expects the following minimal HTML structure:
 * <div class="game-tray"></div>
 */
export default class GameTray {
    
    /**
     * Binds this GameTray to the given element.
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
    }
}
