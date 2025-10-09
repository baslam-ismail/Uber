export type ServiceType = "standard" | "uberX";

function isChristmas(date: Date): boolean {
  const m = date.getMonth(), d = date.getDate(), h = date.getHours();
  return (m === 11 && d === 25) || (m === 11 && d === 24 && h >= 18);
}

function isBirthday(date: Date, birth?: Date): boolean {
  return !!birth && date.getDate() === birth.getDate() && date.getMonth() === birth.getMonth();
}

export function calculatePrice(
  origin: string,
  destination: string,
  km: number,
  date: Date = new Date(),
  service: ServiceType = "standard",
  birth?: Date
): number {
  const base =
    origin === "Paris" && destination === "Paris" ? 2 :
    origin !== "Paris" && destination === "Paris" ? 0 :
    origin === "Paris" && destination !== "Paris" ? 10 : 5;

  let total = base + km * 0.5;
  if (service === "uberX" && !isBirthday(date, birth)) total += 5;
  if (isChristmas(date)) total *= 2;
  return total;
}
