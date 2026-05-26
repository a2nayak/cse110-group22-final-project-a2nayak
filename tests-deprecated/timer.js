import { Timer, TimerType } from "../src/prototype/js/timer.js";

let timer;

beforeEach(() => {
    timer = new Timer();
    timer.reset();
    timer.clearAllRecords();
});

test("init sets the timer settings correctly", () => {
    timer.init(TimerType.countdown, 10, 100);

    const settings = timer.getCurrentSettings();

    expect(settings.timer_type).toBe(TimerType.countdown);
    expect(settings.ticks_per_second).toBe(10);
    expect(settings.time_limit).toBe(100);
    expect(settings.total_time_used).toBe(0);
    expect(settings.timer_ended).toBe(false);
});

test("start automatically ends countdown timer", () => {
    timer.init(TimerType.countdown, 10, 5);

    return new Promise((resolve) => {
        timer.start((result) => {
            expect(result.timer_type).toBe(TimerType.countdown);
            expect(result.ticks_per_second).toBe(10);
            expect(result.time_limit).toBe(5);
            expect(result.total_time_used).toBeGreaterThanOrEqual(5);

            const records = timer.getAllRecords();
            expect(records.length).toBe(1);
            expect(records[0].timer_type).toBe(TimerType.countdown);

            resolve();
        });
    });
});

test("stop stops countdown timer before it ends", () => {
    timer.init(TimerType.countdown, 10, 50);

    let endCallbackCalled = false;

    timer.start(() => {
        endCallbackCalled = true;
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            timer.stop((result) => {
                expect(result.timer_type).toBe(TimerType.countdown);
                expect(result.ticks_per_second).toBe(10);
                expect(result.time_limit).toBe(50);
                expect(result.total_time_used).toBeGreaterThan(0);
                expect(result.total_time_used).toBeLessThan(50);
                expect(endCallbackCalled).toBe(false);

                const records = timer.getAllRecords();
                expect(records.length).toBe(1);

                resolve();
            });
        }, 200);
    });
});

test("start and stop work correctly for stopwatch timer", () => {
    timer.init(TimerType.stopwatch, 10);

    timer.start();

    return new Promise((resolve) => {
        setTimeout(() => {
            timer.stop((result) => {
                expect(result.timer_type).toBe(TimerType.stopwatch);
                expect(result.ticks_per_second).toBe(10);
                expect(result.total_time_used).toBeGreaterThan(0);

                const records = timer.getAllRecords();
                expect(records.length).toBe(1);
                expect(records[0].timer_type).toBe(TimerType.stopwatch);

                resolve();
            });
        }, 200);
    });
});

test("stop should not record twice if called multiple times", () => {
    timer.init(TimerType.stopwatch, 10);

    timer.start();

    timer.stop();
    timer.stop();

    const records = timer.getAllRecords();

    expect(records.length).toBe(1);
});

test("reset resets current timer but does not clear records", () => {
    timer.init(TimerType.stopwatch, 10);

    timer.start();
    timer.stop();

    expect(timer.getAllRecords().length).toBe(1);

    timer.reset();

    const settings = timer.getCurrentSettings();

    expect(settings.total_time_used).toBe(0);
    expect(settings.timer_ended).toBe(false);
    expect(timer.getAllRecords().length).toBe(1);
});

test("clearAllRecords clears all timer records", () => {
    timer.init(TimerType.stopwatch, 10);

    timer.start();
    timer.stop();

    expect(timer.getAllRecords().length).toBe(1);

    timer.clearAllRecords();

    expect(timer.getAllRecords().length).toBe(0);
});

//Yannis add'l:
test("constructor initializes with correct default values", () => {
    const t = new Timer();
    const settings = t.getCurrentSettings();
    expect(settings.timer_type).toBe(TimerType.countdown);
    expect(settings.ticks_per_second).toBe(10);
    expect(settings.time_limit).toBe(300);
    expect(settings.total_time_used).toBe(0);
    expect(settings.timer_ended).toBe(false);
    expect(t.getAllRecords()).toHaveLength(0);
});

test("getCurrentSettings returns a copy, not the internal object", () => {
    const settings = timer.getCurrentSettings();
    settings.total_time_used = 9999;
    expect(timer.getCurrentSettings().total_time_used).toBe(0);
});

test("updateTickPerSecond updates when timer is not running", () => {
    timer.init(TimerType.stopwatch, 10, 0);
    timer.updateTickPerSecond(20);
    expect(timer.getCurrentSettings().ticks_per_second).toBe(20);
});

test("updateTickPerSecond does not update when timer is running", () => {
    timer.init(TimerType.stopwatch, 10, 0);
    timer.start();
    timer.updateTickPerSecond(99);
    expect(timer.getCurrentSettings().ticks_per_second).toBe(10);
    timer.stop();
});

test("multiple stop calls across separate runs accumulate records", () => {
    timer.init(TimerType.stopwatch, 10, 0);
    timer.start();
    timer.stop();

    timer.init(TimerType.stopwatch, 10, 0);
    timer.start();
    timer.stop();

    expect(timer.getAllRecords()).toHaveLength(2);
});
