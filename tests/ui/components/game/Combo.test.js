import Combo from '../../../../src/final/js/ui/components/game/Combo.js';

describe('Combo', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="combo" id="combo-1"><span></span></div>
            <div class="combo" id="combo-2"><span></span></div>
            <div class="combo" id="combo-3"><span></span></div>
            <div class="combo" id="combo-4"><span></span></div>
            <div class="combo" id="combo-5"><span></span></div>
            <div class="combo" id="combo-6"><span></span></div>
            <div class="combo" id="combo-7"><span></span></div>
            <div class="combo" id="combo-8"><span></span></div>
            <div class="combo" id="combo-9"><span></span></div>
            <div class="combo" id="combo-10"><span></span></div>
            <div class="combo" id="combo-11"><span></span></div>
            <div class="combo" id="combo-12"><span></span></div>
            <div class="combo" id="combo-13"><span></span></div>
            <div class="combo" id="combo-14"><span></span></div>
            <div class="combo" id="combo-15"><span></span></div>
        `;
    });

    test('initializes with the correct HTML structure', () => {
        const combo = new Combo(document.querySelector('#combo-1'));
        expect(combo.element).toBe(document.querySelector('#combo-1'));
        expect(combo.countElement).toBe(document.querySelector('#combo-1 span'));
    });

    test.concurrent('increment increases combo count and updates display', async () => {
        const combo = new Combo(document.querySelector('#combo-2'));
        combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(1);
        expect(combo.countElement.textContent).toBe('1');
    });

    test.concurrent('reset sets combo count to 0 and updates display', async () => {
        const combo = new Combo(document.querySelector('#combo-3'));
        combo.increment();
        combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(2);
        expect(combo.countElement.textContent).toBe('2');
        await combo.reset();
        expect(combo.renderedComboCount).toBe(0);
        expect(combo.countElement.textContent).toBe('0');
    });

    test.concurrent('rollDown animates the combo count down to 0', async () => {
        const combo = new Combo(document.querySelector('#combo-4'));
        for(let i = 0; i < 5; i++) combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(5);
        const resetPromise = combo.reset();
        await new Promise(resolve => setTimeout(resolve, 50));
        const midRollCount = combo.renderedComboCount;
        expect(midRollCount).toBeLessThan(5);
        expect(midRollCount).toBeGreaterThan(0);
        await resetPromise;
        expect(combo.renderedComboCount).toBe(0);
    });

    test.concurrent('multiple simultaneous rollDown calls do not cause issues', async () => {
        const combo = new Combo(document.querySelector('#combo-5'));
        for(let i = 0; i < 5; i++) combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(5);
        const resetPromise1 = combo.reset();
        const resetPromise2 = combo.reset();
        expect(resetPromise1).toBe(resetPromise2);
        await resetPromise1;
        expect(combo.renderedComboCount).toBe(0);
    });

    test.concurrent('getting renderedComboCount returns the correct value', async () => {
        const combo = new Combo(document.querySelector('#combo-6'));
        expect(combo.renderedComboCount).toBe(0);
        combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(1);
    });

    test.concurrent('setting renderedComboCount updates the display', async () => {
        const combo = new Combo(document.querySelector('#combo-7'));
        combo.renderedComboCount = 42;
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.countElement.textContent).toBe('42');
    });

    test.concurrent('flash adds the flashed class and sets data-flash-text attribute', async () => {
        const combo = new Combo(document.querySelector('#combo-8'));
        combo.flash();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.element.classList.contains('flashed')).toBe(true);
        expect(combo.element.getAttribute('data-flash-text')).toBe('1x');
    });

    test.concurrent('flash correctly counts up the flash text', async () => {
        const combo = new Combo(document.querySelector('#combo-9'));
        combo.increment();
        combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.element.getAttribute('data-flash-text')).toBe('2x');
        expect(combo.element.classList.contains('flashed')).toBe(true);
        combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.element.getAttribute('data-flash-text')).toBe('3x');
        expect(combo.element.classList.contains('flashed')).toBe(true);
    });

    test.concurrent('increment during rollDown correctly sets the underlying combo count', async () => {
        const combo = new Combo(document.querySelector('#combo-11'));
        for(let i = 0; i < 5; i++) combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(5);
        const resetPromise = combo.reset();
        await new Promise(resolve => setTimeout(resolve, 50));
        combo.increment();
        await resetPromise;
        expect(combo.renderedComboCount).toBe(1);
    });

    test.concurrent('reset during rollDown correctly resets the underlying combo count and rolls down to 0', async () => {
        const combo = new Combo(document.querySelector('#combo-12'));
        for(let i = 0; i < 5; i++) combo.increment();
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(combo.renderedComboCount).toBe(5);
        const resetPromise = combo.reset();
        await new Promise(resolve => setTimeout(resolve, 50));
        await combo.reset();
        await resetPromise;
        expect(combo.renderedComboCount).toBe(0);
    });

    test.concurrent('increment triggers a flash animation', async () => {
        const combo = new Combo(document.querySelector('#combo-13'));
        const flashSpy = jest.spyOn(combo, 'flash');
        combo.increment();
        expect(flashSpy).toHaveBeenCalled();
    });
});
