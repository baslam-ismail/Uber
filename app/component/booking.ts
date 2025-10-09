import { Rider} from "../models/rider";
import { Ride } from "../models/ride";
import { Driver } from "../models/driver";
import { calculatePrice } from "./price_rider";

export function createBooking(rider: Rider, origin: string, destination: string, distanceKm: number): Ride | string {
  if (rider.rideId) {
    return "Le rider a déjà une réservation active.";
  }

  const price = calculatePrice(origin, destination, distanceKm);

  if (rider.balance < price) {
    return "Fonds insuffisants pour réserver la course.";
  }

  const ride: Ride = {
    id: crypto.randomUUID(),
    riderId: rider.id,
    origin,
    destination,
    distanceKm,
    price,
    status: "en cours",
  };

  rider.balance -= price; // on réserve le montant
  rider.rideId = ride.id;

  return ride;
}

export function cancelBooking(rider: Rider, ride: Ride, driver: Driver, today: Date): string {
  if (ride.status === "annulée") {
    return "Cette course est déjà annulée.";
  }

  const isBirthday = (() => {
    const birth = new Date(rider.birthDate);
    return birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth();
  })();

  if (isBirthday) {
    ride.status = "annulée";
    return "Course annulée sans pénalité.";
  }

  if (driver.isOnRoad === true) {
    ride.status = "annulée";
    rider.balance -= 5;
    return "Course annulée avec pénalité de 5€.";
  }

  ride.status = "annulée";
  return "Course annulée sans pénalité.";
}
