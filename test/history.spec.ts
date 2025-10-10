import { describe, test, expect } from "vitest";
import {
  listHistoryForRider,
  frequencyByMonth,
  summaryForRider,
  type Ride,
} from "../app/services/history.service";

const rides: Ride[] = [
  { id: "1", riderId: "r1", driverName: "Alice",   date: new Date("2025-03-10T10:00:00"), origin: "Paris",  destination: "Paris",     price: 7  },
  { id: "2", riderId: "r1", driverName: "Bob",     date: new Date("2025-04-02T09:00:00"), origin: "Paris",  destination: "Banlieue", price: 15 },
  { id: "3", riderId: "r2", driverName: "Charlie", date: new Date("2025-04-05T09:00:00"), origin: "Paris",  destination: "Banlieue", price: 15 },
  { id: "4", riderId: "r1", driverName: "Alice",   date: new Date("2025-04-20T09:00:00"), origin: "Banlieue", destination: "Paris",   price: 5  },
];

describe("Story 4: rider history and usage frequency", () => {
  test("should return empty list when rider has no rides", () => {
    expect(listHistoryForRider("unknown", rides)).toEqual([]);
  });

 
  test("should list rider's rides with driver name, newest first", () => {
    const list = listHistoryForRider("r1", rides);
    expect(list.map(x => x.id)).toEqual(["4", "2", "1"]);
    expect(list[0].driver).toBe("Alice");
  });

  
  test("should compute frequency by month", () => {
    const list = listHistoryForRider("r1", rides);
    expect(frequencyByMonth(list)).toEqual({
      "2025-03": 1,
      "2025-04": 2,
    });
  });

  
  test("should return a summary with total, byMonth and lastRideAt", () => {
    const s = summaryForRider("r1", rides);
    expect(s.total).toBe(3);
    expect(s.byMonth).toEqual({ "2025-03": 1, "2025-04": 2 });
    expect(s.lastRideAt?.toISOString()).toBe(new Date("2025-04-20T09:00:00").toISOString());
    expect(s.list.map(x => x.id)).toEqual(["4", "2", "1"]);
  });

 
  test("should return empty summary for a rider without rides", () => {
    const s = summaryForRider("rX", rides);
    expect(s.total).toBe(0);
    expect(s.byMonth).toEqual({});
    expect(s.lastRideAt).toBeUndefined();
    expect(s.list).toEqual([]);
  });
});
