import { describe, test, expect } from "vitest";
import { calculatePrice } from "../app/component/price_rider";

describe("Story 5: Price should be doubled for Christmas", () => {

  test("should double the price on December 25 (all day)", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-12-25T10:00:00")))
      .toBe(14);
  });

  test("should double the price on December 24 evening (after 6pm)", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-24T19:30:00")))
      .toBe(30);
  });

  test("should not double the price before 6pm on December 24", () => {
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-12-24T12:00:00")))
      .toBe(5);
  });
});
