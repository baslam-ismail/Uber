import { Rider } from "../models/rider";

const riders: Rider[] = [
  {
    id: "1",
    name: "Alice",
    balance: 50,
    birthDate: new Date("1990-01-01"),
  },
  {
    id: "2",
    name: "Bob",
    balance: 100,
    birthDate: new Date("1995-07-10"),
  },
];


export function getRiderById(id: string): Rider | undefined {
  return riders.find((r) => r.id === id);
}

/**
 * (optionnel) Ajouter un nouveau rider
 */
// export function addRider(rider: Rider): void {
//   riders.push(rider);
// }
