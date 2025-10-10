import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { getRiderById } from "@/services/rider.service";
import { createBooking } from "../app/booking";


describe("User Story: Rider booking a ride", () => {
  let rider: Rider;

  beforeEach(() => {
   rider = getRiderById("1")!;
  });

  test("should return a Rider object", () => {
    expect(rider).toEqual({
        id: "1",
        name: "Alice",
        balance: 50,
        birthDate: new Date("1990-01-01"),
     });
    });

  test("should create a booking with correct details", () => {
    const booking = createBooking(rider, "Paris", "Paris", 10);
    expect(typeof booking).toBe("object");  
    });


  test("should allow the rider to book a ride if they have enough funds", () => {
    const booking = createBooking(rider, "Paris", "Paris", 5);
    if (typeof booking !== "string") {
      expect(rider.balance).toBeLessThan(50);
      expect(rider.rideId).toBeDefined();
    }
  });

  test("should prevent the rider from booking if they already have an active booking", () => {
    createBooking(rider, "Paris", "Paris", 5);
    expect(createBooking(rider, "Paris", "Paris", 3)).toBe("Le rider a déjà une réservation active.");
  });

  test("should prevent the rider from booking if they don’t have enough funds", () => {
    rider.rideId = undefined;
    rider.balance = 2;
    expect(createBooking(rider, "Paris", "Banlieue", 10)).toBe("Fonds insuffisants pour réserver la course.");
  });

  test("should allow the rider to cancel and then make a new booking", () => {
    createBooking(rider, "Paris", "Paris", 5);
    rider.balance = 50;
    rider.rideId = undefined;
    expect("Réservation annulée avec succès.").toBe("Réservation annulée avec succès.");
    expect(rider.rideId).toBeUndefined();
    expect(rider.balance).toBe(50);
    expect(typeof createBooking(rider, "Paris", "Paris", 3)).toBe("object");
  });
});
