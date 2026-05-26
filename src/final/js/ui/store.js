export default class Store {
    eventTarget = new EventTarget();

    /**
     * Registers a callback to be called when the given property is updated.
     * @param {string} property 
     * @param {(value: *) => void} callback 
     */
    subscribe(property, callback) {
        this.eventTarget.addEventListener(property, 
            (/** @type {*} */ event) => {callback(event.detail)}
        );
    }

    /**
     * Updates the value of the given property and dispatches an event.
     * @param {string} property 
     * @param {*} value 
     */
    update(property, value) {
        this.eventTarget.dispatchEvent(new CustomEvent(property, {detail: value}));
    }
}

export const store = new Store();