import { startTimer, stopTimer, isRunning } from "../src/final/js/systems/timer.js";

beforeEach(() => {
  jest.useFakeTimers();
  stopTimer(); // ensure clean state before each test
});

afterEach(() => {
  stopTimer();
  jest.useRealTimers();
});

// ── isRunning ─────────────────────────────────────────────────────────────────

describe("isRunning", () => {
  test("returns false before any timer is started", () => {
    expect(isRunning()).toBe(false);
  });

  test("returns true after startTimer is called", () => {
    startTimer({ timer: 5 }, () => {}, () => {});
    expect(isRunning()).toBe(true);
  });

  test("returns false after stopTimer is called", () => {
    startTimer({ timer: 5 }, () => {}, () => {});
    stopTimer();
    expect(isRunning()).toBe(false);
  });
});

// ── stopTimer ─────────────────────────────────────────────────────────────────

describe("stopTimer", () => {
  test("is safe to call when timer is not running", () => {
    expect(() => stopTimer()).not.toThrow();
  });

  test("stops onTick from firing after stopTimer", () => {
    const onTick = jest.fn();
    startTimer({ timer: 5 }, onTick, () => {});
    jest.advanceTimersByTime(2000);
    stopTimer();
    jest.advanceTimersByTime(3000); // should not fire any more ticks
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});

// ── startTimer ────────────────────────────────────────────────────────────────

describe("startTimer", () => {
  test("calls onTick once per second", () => {
    const onTick = jest.fn();
    startTimer({ timer: 3 }, onTick, () => {});
    jest.advanceTimersByTime(3000);
    expect(onTick).toHaveBeenCalledTimes(3);
  });

  test("passes decreasing time remaining to onTick", () => {
    const ticks = [];
    startTimer({ timer: 3 }, (t) => ticks.push(t), () => {});
    jest.advanceTimersByTime(3000);
    expect(ticks).toEqual([2, 1, 0]);
  });

  test("calls onExpire when timer reaches 0", () => {
    const onExpire = jest.fn();
    startTimer({ timer: 2 }, () => {}, onExpire);
    jest.advanceTimersByTime(2000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  test("stops ticking after expiry (onExpire calls stopTimer)", () => {
    const onTick = jest.fn();
    startTimer({ timer: 2 }, onTick, () => {});
    jest.advanceTimersByTime(5000); // extra time after expiry
    expect(onTick).toHaveBeenCalledTimes(2); // only the 2 real ticks
  });

  test("restarting stops the previous timer", () => {
    const onTick = jest.fn();
    startTimer({ timer: 10 }, onTick, () => {});
    jest.advanceTimersByTime(2000); // 2 ticks from first timer
    startTimer({ timer: 5 }, onTick, () => {});
    jest.advanceTimersByTime(2000); // 2 ticks from second timer
    // total = 4 ticks; first timer was stopped so no double-firing
    expect(onTick).toHaveBeenCalledTimes(4);
  });

  test("reads starting time from state.timer", () => {
    const ticks = [];
    startTimer({ timer: 2 }, (t) => ticks.push(t), () => {});
    jest.advanceTimersByTime(1000);
    expect(ticks[0]).toBe(1); // started from 2, first tick is 1
  });

  test("onExpire is not called before time runs out", () => {
    const onExpire = jest.fn();
    startTimer({ timer: 5 }, () => {}, onExpire);
    jest.advanceTimersByTime(4000);
    expect(onExpire).not.toHaveBeenCalled();
  });
});
