import { Rider } from "./models/Rider";
import { Driver } from "./models/Driver";
import { Ride } from "./models/Ride";

export class RideService {
  private rides: Ride[] = [];

  //prix de base
  private getBasePrice(origin: string, destination: string): number {
    if (origin === "Paris" && destination === "Paris") return 2;
    if (origin !== "Paris" && destination === "Paris") return 0;
    if (origin === "Paris" && destination !== "Paris") return 10;
    return 2;
  }

  private getKmPrice(distance: number): number {
    return distance * 0.5;
  }

  private isChristmas(date: Date): boolean {
    return date.getDate() === 25 && date.getMonth() === 11;
  }

  calculateRidePrice(
    rider: Rider,
    driver: Driver,
    origin: string,
    destination: string,
    distanceKm: number,
    date: Date
  ): number {
    let price =
      this.getBasePrice(origin, destination) + this.getKmPrice(distanceKm);

    // uberx+5€ sauf anniv
    if (driver.isUberX && !rider.isBirthday(date)) price += 5;

    // doubler à noel
    if (this.isChristmas(date)) price *= 2;

    return Number(price.toFixed(2));
  }

  // reservation
  bookRide(
    rider: Rider,
    driver: Driver,
    origin: string,
    destination: string,
    distanceKm: number,
    date: Date = new Date()
  ): Ride {
    if (rider.hasActiveRide()) {
      throw new Error("Une réservation est déjà en attente");
    }

    const price = this.calculateRidePrice(
      rider,
      driver,
      origin,
      destination,
      distanceKm,
      date
    );

    // débiter la balance du rider
    rider.debit(rider.balance, price);

    const ride = new Ride(
      `ride-${Date.now()}`,
      rider.id,
      driver.id,
      origin,
      destination,
      distanceKm,
      price,
      date
    );

    this.rides.push(ride);
    rider.addRide(ride);

    // Ajouter point fidélité à la réservation
    rider.addLoyaltyPoint();

    return ride;
  }

  // annuler
  cancelRide(rider: Rider, rideId: string, date: Date = new Date()): boolean {
    const initialBalance: number = rider.balance;

    const ride = this.rides.find(
      (r) => r.id === rideId && r.riderId === rider.id
    );
    if (!ride) throw new Error("Course introuvable");
    if (ride.isCancelled) throw new Error("Course déjà annulée");

    const isBirthday = rider.isBirthday(date);
    const driverOnWay = !!ride.driverId;

    if (!driverOnWay || isBirthday) {
      //rembourser entierement
      rider.credit(ride.price);
    } else if (driverOnWay && !isBirthday) {
      //5€ de penalité
      rider.debit(initialBalance, 5);
    }

    ride.cancel();
    return true;
  }

  //terminer une course (completed)
  completeRide(rider: Rider, rideId: string): Ride {
    const ride = this.rides.find(
      (r) => r.id === rideId && r.riderId === rider.id
    );
    if (!ride) throw new Error("Course introuvable");

    ride.complete();
    return ride;
  }

  //historique
  listRides(rider: Rider): Ride[] {
    return this.rides.filter((r) => r.riderId === rider.id);
  }
}
