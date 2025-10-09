import { describe, test, expect } from "vitest";
import { calculatePrice } from "../app/component/price_rider";

describe("Story 6: UberX +5€, free on rider's birthday", () => {
  
  test("should add 5€ for UberX on a normal day", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-03-10"), "uberX"))
      .toBe(12);
  });

  test("should not add 5€ for UberX on the rider's birthday", () => {
    expect(
      calculatePrice(
        "Paris",
        "Paris",
        10,
        new Date("2025-04-15"),
        "uberX",
        new Date("2000-04-15")
      )
    ).toBe(7);
  });

  test("should double the total price at Christmas (including UberX)", () => {
    expect(
      calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-25"), "uberX")
    ).toBe(40);
  });

  test("should keep standard ride price unchanged", () => {
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-03-10")))
      .toBe(5);
  });
});
