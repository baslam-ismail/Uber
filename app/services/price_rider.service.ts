import { Ride } from "@/models/ride";
import { calculatePrice, ServiceType } from "../price_rider";

const riders: Ride[] = [
  {
      id: "b1",
      riderId: "1",
      status: "en cours",
      origin: "Paris",
      destination: "Banlieue",
      distanceKm: 12,
      price: 25,
  },
  {
      id: "b2",
      riderId: "2",
      status: "en cours",
      origin: "Paris",
      destination: "Paris",
      distanceKm: 10,
      price: 7,
  },
];

export function getRidePrice(
  origin: string,
  destination: string,
  km: number,
  date: Date = new Date(),
  service: ServiceType = "standard",
  birth?: Date
): number {
  return calculatePrice(origin, destination, km, date, service, birth);
}


export function getRideById(id: string): Ride | undefined {
  return riders.find((ride) => ride.id === id);
}


export function getRideIdByRiderId(riderId: string): string | undefined {
  const ride = riders.find((r) => r.riderId === riderId);
  return ride ? ride.id : undefined;
}
