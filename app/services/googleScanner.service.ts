import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function getDistanceInfo(origin: string, destination: string) {
  try {
    const response = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    const element = response.data.rows[0].elements[0];
    const distanceMeters = element.distance.value;
    const distanceKm = distanceMeters / 1000;

    return {
      origin: response.data.origin_addresses[0],
      destination: response.data.destination_addresses[0],
      distanceKm,
    };
  } catch (error: any) {
    console.error("Erreur API Google:", error.message);
    return { error: "Impossible de calculer la distance avec Google Maps API." };
  }
}
