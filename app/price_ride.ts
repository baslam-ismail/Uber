import { isChristmas, isBirthday } from "./clock";
import { GoogleScanner } from "./services/googleScanner";

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

    let total = base + Math.max(km, 0) * 0.5; // km >= 0
    if (service === "uberX" && !isBirthday(date, birth)) total += 5;
    if (isChristmas(date)) total *= 2;

    return Number(total.toFixed(2)); // € avec 2 décimales
}

export type PriceWithDistance = {
    origin: string;
    destination: string;
    distanceKm: number;
    price: number; // €
};

/** Calcule le prix en demandant la distance à l’API Google. */
export async function calculatePriceWithAPI(
    origin: string,
    destination: string,
    date: Date = new Date(),
    service: ServiceType = "standard",
    birth?: Date
): Promise<PriceWithDistance> {
    const scanner = new GoogleScanner({ origin, destination });

    // getDistanceInfo lève une erreur si l’API ne répond pas correctement
    const { distanceKm } = await scanner.getDistanceInfo();

    const price = calculatePrice(origin, destination, distanceKm, date, service, birth);
    return { origin, destination, distanceKm, price };
}
