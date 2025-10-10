import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { Ride } from "../app/models/ride";
import { Driver } from "../app/models/driver";
import { cancelBooking } from "../app/booking";
import { getRiderById } from "@/services/rider.service";
import { getDriverById } from "@/services/driver.service";
import { getRideById, getRideIdByRiderId } from "@/services/ride.service";
import { StubClock } from "./stub-clock";

describe("User Story : Cancel a ride", () => {
  let rider: Rider;
  let driver: Driver;
  let ride: Ride;
  let clock: StubClock;
  let now = new Date("2025-06-15");

  beforeEach(() => {
    clock = new StubClock(now);
    rider = getRiderById("1")!;
    driver = getDriverById("d1")!;
    const rideId = getRideIdByRiderId(rider.id);
    ride = getRideById(rideId!)!;
    const rideFromService = getRideById(rideId!)!;
    ride = { ...rideFromService, status: "en cours" };
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
