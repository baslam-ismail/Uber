import { Clock } from "@/clock";

export class StubClock implements Clock {
  constructor(public date: Date) {}

  getNow(): Date {
    return this.date;
  }
}