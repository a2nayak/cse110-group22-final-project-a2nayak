import { growNextPlant } from "../src/final/js/systems/plants.js";

// ── growNextPlant ─────────────────────────────────────────────────────────────

describe("growNextPlant", () => {
  test("grows plant 0 from 0 to 1 when all are at 0", () => {
    const result = growNextPlant({ plants: [0, 0, 0] });
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(0);
    expect(result[2]).toBe(0);
  });

  test("grows plant 0 again when it is not yet at max", () => {
    const result = growNextPlant({ plants: [1, 0, 0] });
    expect(result[0]).toBe(2);
  });

  test("grows plant 0 to max (3)", () => {
    const result = growNextPlant({ plants: [2, 0, 0] });
    expect(result[0]).toBe(3);
  });

  test("skips plant 0 at max and grows plant 1", () => {
    const result = growNextPlant({ plants: [3, 0, 0] });
    expect(result[0]).toBe(3);
    expect(result[1]).toBe(1);
    expect(result[2]).toBe(0);
  });

  test("skips plants 0 and 1 at max, grows plant 2", () => {
    const result = growNextPlant({ plants: [3, 3, 0] });
    expect(result[0]).toBe(3);
    expect(result[1]).toBe(3);
    expect(result[2]).toBe(1);
  });

  test("does not change array when all plants are at max", () => {
    const result = growNextPlant({ plants: [3, 3, 3] });
    expect(result).toEqual([3, 3, 3]);
  });

  test("only increments one plant per call", () => {
    const result = growNextPlant({ plants: [0, 0, 0] });
    const total = result.reduce((sum, v) => sum + v, 0);
    expect(total).toBe(1);
  });

  test("returns the plants array", () => {
    const result = growNextPlant({ plants: [0, 1, 2] });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });
});
