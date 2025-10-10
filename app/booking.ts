import { Rider} from "./models/rider";
import { Ride } from "./models/ride";
import { Driver } from "./models/driver";
import { calculatePrice, calculatePriceWithAPI} from "./price_rider";
import { StubGoogleScanner } from "../test/stub-googleScanner";

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

  rider.balance -= price;
  rider.rideId = ride.id;

  return ride;
}

/**
 * Nouvelle version — utilise Google Maps pour déterminer la distance automatiquement
 */
export async function createBookingWithAPI(
rider: Rider, origin: string, destination: string, stubService?: StubGoogleScanner): Promise<Ride | string> {
  if (rider.rideId) {
    return "Le rider a déjà une réservation active.";
  }

  const result = await calculatePriceWithAPI(origin, destination);

  if (typeof result === "string") return result;
  if (result === undefined) return "Impossible de calculer la distance/prix.";

  const { distanceKm, price } = result;

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

  rider.balance -= price;
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
