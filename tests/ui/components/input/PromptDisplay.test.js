import PromptDisplay from "../../../../src/final/js/ui/components/game/input/PromptDisplay";

describe('PromptDisplay', () => {
    /** @type {PromptDisplay} */
    let promptDisplay;
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="prompt-display">
                <p class="prompt-display-text"></p>
            </div>
        `;
        promptDisplay = new PromptDisplay(document.querySelector('.prompt-display'));
    });

    test('initial elements are set correctly', () => {
        expect(promptDisplay.element).toBe(document.querySelector('.prompt-display'));
        expect(promptDisplay.promptTextElement).toBe(document.querySelector('.prompt-display-text'));
    });

    test('initializes with empty text', () => {
        expect(promptDisplay.promptTextElement.textContent).toBe('');
    });

    test('sets prompt text correctly', () => {
        promptDisplay.setText('test prompt');
        expect(promptDisplay.promptTextElement.textContent).toBe('test prompt');
    });

    test('updates prompt text correctly', () => {
        promptDisplay.setText('first prompt');
        expect(promptDisplay.promptTextElement.textContent).toBe('first prompt');
        promptDisplay.setText('second prompt');
        expect(promptDisplay.promptTextElement.textContent).toBe('second prompt');  
    });

    test('handles empty string prompt', () => {
        promptDisplay.setText('');
        expect(promptDisplay.promptTextElement.textContent).toBe('');
    });
});
