import { Driver } from "../models/driver";

const drivers: Driver[] = [
  {
    id: "d1",
    name: "Bob",
    isOnRoad: false,
  },
  {
    id: "d2",
    name: "Charlie",
    isOnRoad: true,
  },
];

export function getDriverById(id: string): Driver | undefined {
  return drivers.find((driver) => driver.id === id);
}

export function setDriverStatus(id: string, isOnRoad: boolean): boolean {
  const driver = getDriverById(id);
  if (!driver) return false;
  driver.isOnRoad = isOnRoad;
  return true;
}
