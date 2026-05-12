import * as timer from '../src/prototype/js/timer.js';

beforeEach(() => {
    timer.TimerReset();
    timer.ClearAllTimerRecords();
});

test("TimerInit sets the timer settings correctly", () => {
    timer.TimerInit(timer.timer_type.countdown, 10, 100);

    const settings = timer.GetCurrentTimerSettings();

    expect(settings.timer_type).toBe(timer.timer_type.countdown);
    expect(settings.ticks_per_second).toBe(10);
    expect(settings.time_limit).toBe(100);
    expect(settings.total_time_used).toBe(0);
    expect(settings.timer_ended).toBe(false);
});

test("TimerStart automatically ends countdown timer", (done) => {
    timer.TimerInit(timer.timer_type.countdown, 10, 5);

    timer.TimerStart((result) => {
        expect(result.timer_type).toBe(timer.timer_type.countdown);
        expect(result.ticks_per_second).toBe(10);
        expect(result.time_limit).toBe(5);
        expect(result.total_time_used).toBeGreaterThanOrEqual(5);

        const records = timer.GetAllTimerRecords();
        expect(records.length).toBe(1);
        expect(records[0].timer_type).toBe(timer.timer_type.countdown);

        done();
    });
});

test("TimerStop stops countdown timer before it ends", (done) => {
    timer.TimerInit(timer.timer_type.countdown, 10, 50);

    let endCallbackCalled = false;

    timer.TimerStart(() => {
        endCallbackCalled = true;
    });

    setTimeout(() => {
        timer.TimerStop((result) => {
            expect(result.timer_type).toBe(timer.timer_type.countdown);
            expect(result.ticks_per_second).toBe(10);
            expect(result.time_limit).toBe(50);
            expect(result.total_time_used).toBeGreaterThan(0);
            expect(result.total_time_used).toBeLessThan(50);
            expect(endCallbackCalled).toBe(false);

            const records = timer.GetAllTimerRecords();
            expect(records.length).toBe(1);

            done();
        });
    }, 200);
});

test("TimerStart and TimerStop work correctly for stopwatch timer", (done) => {
    timer.TimerInit(timer.timer_type.stopwatch, 10);

    timer.TimerStart();

    setTimeout(() => {
        timer.TimerStop((result) => {
            expect(result.timer_type).toBe(timer.timer_type.stopwatch);
            expect(result.ticks_per_second).toBe(10);
            expect(result.total_time_used).toBeGreaterThan(0);

            const records = timer.GetAllTimerRecords();
            expect(records.length).toBe(1);
            expect(records[0].timer_type).toBe(timer.timer_type.stopwatch);

            done();
        });
    }, 200);
});

test("TimerStop should not record twice if called multiple times", () => {
    timer.TimerInit(timer.timer_type.stopwatch, 10);

    timer.TimerStart();

    timer.TimerStop();
    timer.TimerStop();

    const records = timer.GetAllTimerRecords();

    expect(records.length).toBe(1);
});

test("TimerReset resets current timer but does not clear records", () => {
    timer.TimerInit(timer.timer_type.stopwatch, 10);

    timer.TimerStart();
    timer.TimerStop();

    expect(timer.GetAllTimerRecords().length).toBe(1);

    timer.TimerReset();

    const settings = timer.GetCurrentTimerSettings();

    expect(settings.total_time_used).toBe(0);
    expect(settings.timer_ended).toBe(false);
    expect(timer.GetAllTimerRecords().length).toBe(1);
});

test("ClearAllTimerRecords clears all timer records", () => {
    timer.TimerInit(timer.timer_type.stopwatch, 10);

    timer.TimerStart();
    timer.TimerStop();

    expect(timer.GetAllTimerRecords().length).toBe(1);

    timer.ClearAllTimerRecords();

    expect(timer.GetAllTimerRecords().length).toBe(0);
});