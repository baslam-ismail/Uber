// cancelBooking.test.ts
import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { Ride } from "../app/models/ride";
import { Driver } from "../app/models/driver";
import { cancelBooking } from "../app/component/booking";

describe("User Story 2 : Cancel a ride", () => {
  let rider: Rider;
  let driver: Driver;
  let ride: Ride;
  let today: Date;

  beforeEach(() => {
    rider = {
      id: "1",
      name: "Alice",
      balance: 50,
      birthDate: new Date("1990-01-01"),
    };

    driver = {
      id: "d1",
      name: "Bob",
      isAvailable: true,
      isOnRoad: false,
    };

    ride = {
      id: "b1",
      riderId: "1",
      status: "en cours",
      origin: "Point A",
      destination: "Point B",
      distanceKm: 12,
      price: 25,
    };

    today = new Date("2025-01-01");
  });

  test("should cancel the ride without penalty if the driver is not on the road", () => {
    driver.isOnRoad = false;
    expect(cancelBooking(rider, ride, driver, today)).toBe("Course annulée sans pénalité.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(50);
  });


  test("should apply a 5€ penalty if the driver is already on the road", () => {
    driver.isOnRoad = true;
    rider.balance = 50;
    today = new Date("2025-06-15");
    expect(cancelBooking(rider, ride, driver, today)).toBe("Course annulée avec pénalité de 5€.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(45);
  });


  test("should not allow cancelling a ride that is already cancelled", () => {
    ride.status = "annulée";
    expect(cancelBooking(rider, ride, driver, today)).toBe("Cette course est déjà annulée.");
  });


  test("should cancel the ride for free if it’s the rider’s birthday", () => {
    driver.isOnRoad = true;
    rider.balance = 50;
    today = new Date("2025-01-01");
    expect(cancelBooking(rider, ride, driver, today)).toBe("Course annulée sans pénalité.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(50);
  });
});
