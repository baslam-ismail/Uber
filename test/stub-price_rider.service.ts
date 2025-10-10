export class StubPriceService {
  constructor(private readonly distanceKm: number, private readonly price: number) {}

  async calculatePriceWithAPI(origin: string, destination: string) {
    return {
      distanceKm: this.distanceKm,
      price: this.price,
    };
  }
}
