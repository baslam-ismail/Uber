export class Ride {
  public isCancelled = false;
  public isCompleted = false;
  public isDriverOnWay = false;

  constructor(
    public id: string,
    public riderId: string,
    public driverId: string,
    public origin: string,
    public destination: string,
    public distanceKm: number,
    public price: number,
    public date: Date
  ) {}

  cancel() {
    this.isCancelled = true;
  }

  complete() {
    this.isCompleted = true;
  }
}
