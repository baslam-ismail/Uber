export function calculatePrice(origin: string, destination: string, distanceKm: number): number {
  const basePrice =
    origin === "Paris" && destination === "Paris"
      ? 2
      : origin !== "Paris" && destination === "Paris"
      ? 0
      : origin === "Paris" && destination !== "Paris"
      ? 10
      : 5; // par défaut (ex. extérieur -> extérieur)

  const distancePrice = distanceKm * 0.5;
  return basePrice + distancePrice;
}