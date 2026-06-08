/**
 * A simple state management class that allows components
 * to more easily access and update shared state, without needing to prop drill.
 */
export default class Store {
    /** @type {EventTarget} - The EventTarget used for managing subscriptions and dispatching events. */
    eventTarget = new EventTarget();
    /** @type {*} - The data stored in the Store. */
    data = {};

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
        this.data[property] = value;
        this.eventTarget.dispatchEvent(new CustomEvent(property, {detail: value}));
    }
    
    /**
     * Retrieves the current value of the given property.
     * @param {string} property 
     * @returns {*}
     */
    retrieve(property) {
        return this.data[property];
    }
}

export const store = new Store();