import { describe, test, expect, beforeEach } from "vitest";
import { getRidePrice } from "../app/services/price_rider.service";


describe("User Story: Rider booking a ride with the correct price", () => {
 

   test("should calculate the correct price for a ride from Paris to Paris", () => {
    const price = getRidePrice("Paris", "Paris", 10);
    expect(price).toBe(2 + 10 * 0.5);
  });

  test("should calculate the correct price for a ride from outside Paris to Paris", () => {
    const price = getRidePrice("Banlieue", "Paris", 10);
    expect(price).toBe(0 + 10 * 0.5);
  });

  test("should calculate the correct price for a ride from Paris to outside Paris", () => {
    const price = getRidePrice("Paris", "Banlieue", 10);
    expect(price).toBe(10 + 10 * 0.5);
  });
});