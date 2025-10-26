export type Station = {
  id: number | string; // Support both number (mock) and UUID string (API)
  name: string;
  address: string;
  lat: number;
  lng: number;
  openHours: string; // "24/7" or "08:00 - 21:00"
  available: number; // số pin đầy
  capacity: number; // tổng pin
  charging: number; // đang sạc
  maintenance: number;
  reserved?: number; // số pin đã đặt trước
  type: "station" | "dealer" | "service";
  distanceKm?: number; // distance in km
  rating?: number;
  // Additional fields from API
  city?: string;
  status?: string;
  image_url?: string;
  staff?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_verified: boolean;
    is_2fa_enabled: boolean;
  };
  inventory?: {
    id: string;
    total: number;
    available: number;
    charging: number;
    maintenance: number;
    reserved: number;
    station_id: string;
  };
  distance_m?: number;
  duration_seconds?: number;
  duration_minutes?: number;
};

export type FilterType = "all" | "station" | "dealer" | "service";

export type MapViewMode = "standard" | "satellite" | "hybrid";
