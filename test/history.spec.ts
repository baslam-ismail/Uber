import { describe, test, expect } from "vitest";
import { listHistoryForRider, frequencyByMonth, summaryForRider } from "../app/services/history.service";
import { Ride } from "../app/models/ride";

const rides: (Ride & { date: Date })[] = [
  { id: "1", riderId: "r1", driverId: "d1", origin: "Paris", destination: "Paris", distanceKm: 5, price: 10, status: "acceptée", date: new Date("2025-03-01") },
  { id: "2", riderId: "r1", driverId: "d2", origin: "Paris", destination: "Banlieue", distanceKm: 8, price: 15, status: "acceptée", date: new Date("2025-04-05") },
  { id: "3", riderId: "r2", driverId: "d3", origin: "Banlieue", destination: "Paris", distanceKm: 10, price: 20, status: "acceptée", date: new Date("2025-04-10") },
  { id: "4", riderId: "r1", driverId: "d1", origin: "Paris", destination: "Centre", distanceKm: 3, price: 8, status: "acceptée", date: new Date("2025-04-15") },
];

describe("Story 4: Rider history", () => {
  test("should list only rides of this rider", () => {
    const list = listHistoryForRider("r1", rides);
    expect(list.map(r => r.id)).toEqual(["4", "2", "1"]); 
  });

  test("should calculate frequency by month", () => {
    const freq = frequencyByMonth([
      { date: new Date("2025-03-01") },
      { date: new Date("2025-03-10") },
      { date: new Date("2025-04-15") },
    ]);
    expect(freq).toEqual({ "2025-03": 2, "2025-04": 1 });
  });

  test("should return summary with total, byMonth, and lastRide", () => {
    const summary = summaryForRider("r1", rides);
    expect(summary.total).toBe(3);
    expect(summary.byMonth).toEqual({ "2025-03": 1, "2025-04": 2 });
    expect(summary.lastRide?.toISOString()).toBe(new Date("2025-04-15").toISOString());
  });

  test("should return empty summary if no rides", () => {
    const summary = summaryForRider("none", rides);
    expect(summary.total).toBe(0);
    expect(summary.byMonth).toEqual({});
    expect(summary.lastRide).toBeUndefined();
  });
});
