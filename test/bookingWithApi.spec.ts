import { describe, test, expect, beforeEach } from "vitest";
import { Rider } from "../app/models/rider";
import { createBookingWithAPI } from "../app/booking";
import { getRiderById } from "@/services/rider.service";
import { StubGoogleScanner } from "./stub-googleScanner";

describe("User Story 7 : Booking a ride using injected Google Maps stub", () => {
  let rider: Rider;
  let stubService: StubGoogleScanner;

  beforeEach(() => {
    rider = getRiderById("1")!;
    stubService = new StubGoogleScanner("Paris", "Boulogne-Billancourt", 10);
  });

  test("should create a booking using the stubbed Google service", async () => {
    const booking = await createBookingWithAPI(rider, "Paris", "Boulogne-Billancourt", stubService);

    if (typeof booking !== "string") {
      expect(booking.distanceKm).toBe(10);
      expect(booking.price).toBe(15);
      expect(rider.balance).toBe(85);
      expect(rider.rideId).toBeDefined();
    }
  });
});
