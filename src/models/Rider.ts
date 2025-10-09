import { Ride } from "./Ride";

export class Rider {
  id: string;
  name: string;
  balance: number;
  birthday: Date;
  loyaltyPoints: number = 0;
  rides: Ride[] = [];

  constructor(id: string, name: string, balance: number, birthday: Date) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.birthday = birthday;
  }

  addRide(ride: Ride) {
    this.rides.push(ride);
  }

  debit(balance: number, amount: number) {
    if (amount > this.balance) throw new Error("Fonds insuffisants");
    this.balance = balance - amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }

  isBirthday(date: Date): boolean {
    return (
      date.getDate() === this.birthday.getDate() &&
      date.getMonth() === this.birthday.getMonth()
    );
  }

  addLoyaltyPoint() {
    this.loyaltyPoints += 1;
  }

  hasActiveRide(): boolean {
    return this.rides.some((r) => !r.isCancelled && !r.isCompleted);
  }
}
