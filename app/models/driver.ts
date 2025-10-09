export interface Driver {
  id: string;
  name: string;
  isAvailable?: boolean;
  isOnRoad: boolean;
}