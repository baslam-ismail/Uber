export type DistanceInfo = {
    origin: string;
    destination: string;
    distanceKm: number;
};

export interface IGoogleScanner {
    /** Retourne la distance entre origin et destination en kilomètres. */
    getDistanceInfo(): Promise<DistanceInfo>;
}
