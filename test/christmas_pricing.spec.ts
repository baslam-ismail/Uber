import { describe, test, expect, beforeEach } from "vitest";
import { calculatePrice } from "../app/price_ride";
import { StubClock } from "./stub-clock";


describe("User Story : Price should be doubled at Christmas", () => {
   let clock: StubClock;
   let now = new Date("2025-12-25T10:00:00");

  beforeEach(() => {
    clock = new StubClock(now);
  });


  test("should calculate a normal price for a city ride (no Christmas)", () => {
    clock = new StubClock(new Date("2025-03-10"));
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-03-10"))).toBe(5);
  });


  test("should double the price all day on December 25", () => {
    expect(calculatePrice("Paris", "Paris", 10, clock.getNow())).toBe(14);
  });

  test("should double the price late on December 25 evening too", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, clock.getNow())).toBe(30);
  });

  test("should double the price on December 24 evening after 6pm", () => {
    clock = new StubClock(new Date("2025-12-24T19:30:00"));
    expect(calculatePrice("Paris", "Banlieue", 10, clock.getNow())).toBe(30);
  });

  test("should not double the price before 6pm on December 24", () => {
    clock = new StubClock(new Date("2025-12-24T17:30:00"));
    expect(calculatePrice("Banlieue", "Paris", 10, clock.getNow())).toBe(5);
  });

  test("should not double the price after Christmas", () => {
    clock = new StubClock(new Date("2025-12-26T10:00:00"));
    expect(calculatePrice("Paris", "Banlieue", 10, clock.getNow())).toBe(15);
  });
});

