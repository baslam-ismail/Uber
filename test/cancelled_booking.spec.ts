import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { Ride } from "../app/models/ride";
import { Driver } from "../app/models/driver";
import { cancelBooking } from "../app/component/booking";

export interface Clock {
  getNow(): Date;
}

export class StubClock implements Clock {
  constructor(public date: Date) {}

  getNow(): Date {
    return this.date;
  }
}

describe("User Story 2 : Cancel a ride", () => {
  let rider: Rider;
  let driver: Driver;
  let ride: Ride;
  let clock: StubClock;
  let now = new Date("2025-06-15");

  beforeEach(() => {
    clock = new StubClock(now);

    rider = {
      id: "1",
      name: "Alice",
      balance: 50,
      birthDate: new Date("1990-01-01"),
    };

    driver = {
      id: "d1",
      name: "Bob",
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
  });

  test("should cancel the ride without penalty if the driver is not on the road", () => {
    driver.isOnRoad = false;
    expect(cancelBooking(rider, ride, driver, clock.getNow())).toBe("Course annulée sans pénalité.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(50);
  });


  test("should apply a 5€ penalty if the driver is already on the road", () => {
    driver.isOnRoad = true;
    rider.balance = 50;
    expect(cancelBooking(rider, ride, driver, clock.getNow())).toBe("Course annulée avec pénalité de 5€.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(45);
  });


  test("should not allow cancelling a ride that is already cancelled", () => {
    ride.status = "annulée";
    expect(cancelBooking(rider, ride, driver, clock.getNow())).toBe("Cette course est déjà annulée.");
  });


  test("should cancel the ride for free if it’s the rider’s birthday", () => {
    driver.isOnRoad = true;
    rider.balance = 50;
    clock = new StubClock(new Date("2025-01-01"));
    expect(cancelBooking(rider, ride, driver, clock.getNow())).toBe("Course annulée sans pénalité.");
    expect(ride.status).toBe("annulée");
    expect(rider.balance).toBe(50);
  });
});
