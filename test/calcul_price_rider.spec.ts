import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { calculatePrice } from "../app/component/price_rider";

describe("User Story: Rider booking a ride with the correct price", () => {
  let rider: Rider;

  beforeEach(() => {
    rider = {
      id: "1",
      name: "Alice",
      balance: 50,
      birthDate: new Date("1990-01-01"),
    };
  });

  test("should calculate the correct price for a ride from Paris to Paris", () => {
    expect(calculatePrice("Paris", "Paris", 10)).toBe(2 + 10 * 0.5); 
  });

  test("should calculate the correct price for a ride from outside Paris to Paris", () => {
    expect(calculatePrice("Banlieue", "Paris", 10)).toBe(0 + 10 * 0.5); 
  });

  test("should calculate the correct price for a ride from Paris to outside Paris", () => {
    expect(calculatePrice("Paris", "Banlieue", 10)).toBe(10 + 10 * 0.5); 
  });
});