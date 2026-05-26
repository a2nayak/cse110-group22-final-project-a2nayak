
/**
 * Asserts that an element is an HTMLElement.
 * @param {Element | null} element 
 * @returns {HTMLElement}
 */
export function assertHTMLElement(element) {
    if (!(element instanceof HTMLElement)) {
        throw new Error('Expected an HTMLElement, but got: ' + element);
    }
    return element;
}

/**
 * Asserts that an element is an HTMLInputElement.
 * @param {Element | null} element 
 * @returns {HTMLInputElement}
 */
export function assertHTMLInputElement(element) {
    if (!(element instanceof HTMLInputElement)) {
        throw new Error('Expected an HTMLInputElement, but got: ' + element);
    }
    return element;
}

/**
 * Asserts that an element is an HTMLSelectElement.
 * @param {Element | null} element 
 * @returns {HTMLSelectElement}
 */
export function assertHTMLSelectElement(element) {
    if (!(element instanceof HTMLSelectElement)) {
        throw new Error('Expected an HTMLSelectElement, but got: ' + element);
    }
    return element;
}