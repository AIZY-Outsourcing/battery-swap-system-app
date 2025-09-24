export type Station = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openHours: string; // "24/7" or "08:00 - 21:00"
  available: number; // số pin đầy
  capacity: number; // tổng pin
  charging: number; // đang sạc
  maintenance: number;
  type: "station" | "dealer" | "service";
  distanceKm?: number; // client computed
  rating?: number;
};

export type FilterType = "all" | "station" | "dealer" | "service";

export type MapViewMode = "standard" | "satellite" | "hybrid";
