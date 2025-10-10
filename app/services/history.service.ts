import { Ride } from "../models/ride";


type RideWithDate = Ride & { date: Date };

export function listHistoryForRider(riderId: string, rides: RideWithDate[]) {
  return rides
    .filter(r => r.riderId === riderId)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); 
}

export function frequencyByMonth(rides: { date: Date }[]) {
  const counts: Record<string, number> = {};
  for (const r of rides) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function summaryForRider(riderId: string, rides: RideWithDate[]) {
  const list = listHistoryForRider(riderId, rides);
  const byMonth = frequencyByMonth(list);
  const lastRide = list[0]?.date; 
  return { total: list.length, byMonth, lastRide };
}
