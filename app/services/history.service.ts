export type Ride = {
  id: string;
  riderId: string;
  driverName: string;
  date: Date;
  origin: string;
  destination: string;
  price: number;
};


export function listHistoryForRider(
  riderId: string,
  allRides: Ride[]
) {
  return allRides
    .filter(r => r.riderId === riderId)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(r => ({
      id: r.id,
      date: r.date,
      origin: r.origin,
      destination: r.destination,
      driver: r.driverName,
      price: r.price,
    }));
}


export function frequencyByMonth(rides: { date: Date }[]) {
  return rides.reduce<Record<string, number>>((acc, r) => {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}


export function summaryForRider(riderId: string, allRides: Ride[]) {
  const list = listHistoryForRider(riderId, allRides);
  const byMonth = frequencyByMonth(list);
  const lastRideAt = list[0]?.date; 
  return { total: list.length, byMonth, lastRideAt, list };
}
