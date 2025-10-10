/**
 * Stub pour simuler les appels à l'API Google Maps Distance Matrix.
 * Permet de renvoyer des valeurs fixes en test unitaire.
 */
export class StubGoogleScanner {
  constructor(
    private readonly origin: string,
    private readonly destination: string,
    private readonly distanceKm: number
  ) {}

  async getDistanceInfo(): Promise<{
    origin: string;
    destination: string;
    distanceKm: number;
  }> {
    return {
      origin: this.origin,
      destination: this.destination,
      distanceKm: this.distanceKm,
    };
  }
}
