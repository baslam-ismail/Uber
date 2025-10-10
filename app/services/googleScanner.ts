import 'dotenv/config';
import { Client, TravelMode,UnitSystem,  type DistanceMatrixResponseData } from '@googlemaps/google-maps-services-js';
import type { IGoogleScanner, DistanceInfo } from './googleScanner.types';

type GoogleScannerOpts = {
    origin: string;
    destination: string;
    apiKey?: string; // par défaut process.env.GOOGLE_API_KEY
};

export class GoogleScanner implements IGoogleScanner {
    private readonly client = new Client({});
    private readonly origin: string;
    private readonly destination: string;
    private readonly apiKey: string;

    constructor(opts: GoogleScannerOpts) {
        this.origin = opts.origin;
        this.destination = opts.destination;
        this.apiKey = opts.apiKey ?? process.env.GOOGLE_API_KEY ?? '';
        if (!this.apiKey) {
            throw new Error('GOOGLE_API_KEY manquante (env GOOGLE_API_KEY)');
        }
    }

    async getDistanceInfo(): Promise<DistanceInfo> {
        const resp = await this.client.distancematrix({
            params: {
                origins: [this.origin],
                destinations: [this.destination],
                mode: TravelMode.driving,
                units: UnitSystem.metric,
                key: this.apiKey,
            },
            timeout: 10_000,
        });

        const data: DistanceMatrixResponseData = resp.data;
        const element = data.rows?.[0]?.elements?.[0];

        if (!element || element.status !== 'OK' || !element.distance) {
            throw new Error(`Distance introuvable: ${JSON.stringify(element)}`);
        }

        const distanceKm = element.distance.value / 1000; // API renvoie en mètres

        return {
            origin: this.origin,
            destination: this.destination,
            distanceKm: Number(distanceKm.toFixed(2)),
        };
    }
}
