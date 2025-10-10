export interface Ride {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  price: number;
  riderId: string;
  driverId?: string;
  status: 'en cours' | 'acceptée' | 'annulée';
}