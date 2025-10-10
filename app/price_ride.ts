import { isChristmas, isBirthday } from "./clock";
import { getDistanceInfo } from "./services/googleScanner.service";

export type ServiceType = "standard" | "uberX";

export function calculatePrice(
  origin: string,
  destination: string,
  km: number,
  date: Date = new Date(),
  service: ServiceType = "standard",
  birth?: Date
): number {
  const base =
    origin === "Paris" && destination === "Paris" ? 2 :
    origin !== "Paris" && destination === "Paris" ? 0 :
    origin === "Paris" && destination !== "Paris" ? 10 : 5;

  let total = base + km * 0.5;
  if (service === "uberX" && !isBirthday(date, birth)) total += 5;
  if (isChristmas(date)) total *= 2;
  return total;
}

/*
 * Nouvelle version — utilise l'API Google Maps pour calculer automatiquement la distance.
 */
export async function calculatePriceWithAPI(
  origin: string,
  destination: string,
  date: Date = new Date(),
  service: ServiceType = "standard",
  birth?: Date
) {
  const result = await getDistanceInfo(origin, destination);

  if ("error" in result) return result.error;

  const { distanceKm } = result;
  const price = calculatePrice(origin, destination, distanceKm, date, service, birth);

  return { ...result, price };
}
