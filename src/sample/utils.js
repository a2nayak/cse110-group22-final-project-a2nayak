
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
