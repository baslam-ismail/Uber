import { describe, test, expect } from "vitest";
import { calculatePrice } from "../app/component/price_rider";

describe("Story 5: Price should be doubled at Christmas", () => {

  // === ÉTAPE 1 : vérifier les calculs de base sans Noël ===
  test("should calculate a normal price for a city ride (no Christmas)", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-03-10"))).toBe(7);
  });

  test("should calculate a normal price for a Paris to suburb ride", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-03-10"))).toBe(15);
  });

  test("should calculate a normal price for a suburb to Paris ride", () => {
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-03-10"))).toBe(5);
  });


  // === ÉTAPE 2 : vérifier le doublement le 25 décembre ===
  test("should double the price all day on December 25", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-12-25T10:00:00"))).toBe(14);
  });

  test("should double the price late on December 25 evening too", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-25T23:00:00"))).toBe(30);
  });


  // === ÉTAPE 3 : vérifier la veille de Noël ===
  test("should double the price on December 24 evening after 6pm", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-24T19:30:00"))).toBe(30);
  });

  test("should not double the price before 6pm on December 24", () => {
    expect(calculatePrice("Banlieue", "Paris", 10, new Date("2025-12-24T12:00:00"))).toBe(5);
  });


  // === ÉTAPE 4 : vérifier un jour normal (aucun doublement) ===
  test("should not double the price on a normal day", () => {
    expect(calculatePrice("Paris", "Paris", 10, new Date("2025-02-10"))).toBe(7);
  });

  test("should not double the price after Christmas", () => {
    expect(calculatePrice("Paris", "Banlieue", 10, new Date("2025-12-26T10:00:00"))).toBe(15);
  });
});
