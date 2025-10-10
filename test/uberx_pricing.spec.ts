import { describe, test, expect } from "vitest";
import { calculatePrice } from "../app/price_rider";

describe("User Story: UberX adds +5€, but free on the rider's birthday", () => {

  test("should return the normal price for a basic ride (Paris -> Paris)", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-03-10"))).toBe(7);
  });

  test("should return the normal price for a suburb to Paris ride", () => {
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-03-10"))).toBe(5);
  });

  test("should return the normal price for a Paris to suburb ride", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-03-10"))).toBe(15);
  });


  test("should add 5€ for UberX on a normal day", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-03-10"), "uberX")).toBe(12);
  });

  test("should add 5€ for UberX for other routes too", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-03-10"), "uberX")).toBe(20);
  });


  test("should not add 5€ if it's the rider's birthday", () => {
    expect(calculatePrice( "Paris", "Paris",10,new Date("2025-04-15"),"uberX",new Date("2000-04-15"))).toBe(7);
  });

  test("should add 5€ if it's NOT the rider's birthday", () => {
    expect(calculatePrice("Paris","Paris",10,new Date("2025-04-16"),"uberX",new Date("2000-04-15"))).toBe(12);
  });


  test("should double the total price at Christmas (including UberX)", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-25"), "uberX")).toBe(40);
  });

  test("should double the price at Christmas even without UberX", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-25"))).toBe(30);
  });

  test("should not double the price before Christmas", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-23"))).toBe(15);
  });
});
