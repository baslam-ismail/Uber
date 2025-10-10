import type { IGoogleScanner } from './googleScanner.types';

export type Rider = { id: number; name: string; balance: number };
export type Ride = {
    id?: number;
    origin: string;
    destination: string;
    distanceKm: number;
    price: number;         // en euros, 2 décimales
    status: 'PENDING' | 'ASSIGNED' | 'CANCELLED' | 'COMPLETED';
    riderId: number;
    driverId?: number | null;
    booked_at: Date;
    cancelled_at?: Date | null;
    uberx: boolean;
};

// règles de pricing (modifiable)
const BASE_PRICE_EUR = 5.0;
const PRICE_PER_KM_EUR = 1.0;

/**
 * Calcule la distance via le scanner et construit une booking (en mémoire).
 */
export async function createBookingWithAPI(
    rider: Rider,
    origin: string,
    destination: string,
    scanner: IGoogleScanner,
    { uberx = false }: { uberx?: boolean } = {}
): Promise<Ride | string> {
    const { distanceKm } = await scanner.getDistanceInfo();

    const price = Number((BASE_PRICE_EUR + distanceKm * PRICE_PER_KM_EUR).toFixed(2));
    if (rider.balance < price) {
        return 'INSUFFICIENT_FUNDS';
    }

    // débite le rider (en vrai, fais l'UPDATE en DB + transaction)
    rider.balance = Number((rider.balance - price).toFixed(2));

    const ride: Ride = {
        origin,
        destination,
        distanceKm,
        price,
        status: 'PENDING',
        riderId: rider.id,
        driverId: null,
        booked_at: new Date(),
        uberx,
    };

    return ride;
}
