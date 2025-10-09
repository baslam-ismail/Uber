export interface Rider {
  id: string;
  name: string;
  balance: number; 
  birthDate: Date; 
  currentBookingId?: string; // null s’il n’a pas de réservation active
}
