import type { IGoogleScanner, DistanceInfo } from '@/services/googleScanner.types';

type StubOpts = { origin: string; destination: string; distanceKm: number };

/** Stub pour Google Maps : renvoie des valeurs fixes. */
export class StubGoogleScanner implements IGoogleScanner {
    private readonly origin: string;
    private readonly destination: string;
    private readonly distanceKm: number;

    constructor(opts: StubOpts) {
        this.origin = opts.origin;
        this.destination = opts.destination;
        this.distanceKm = opts.distanceKm;
    }

    async getDistanceInfo(): Promise<DistanceInfo> {
        return {
            origin: this.origin,
            destination: this.destination,
            distanceKm: this.distanceKm,
        };
    }
}
