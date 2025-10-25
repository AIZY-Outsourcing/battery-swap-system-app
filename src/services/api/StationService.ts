import { api } from "./index";
import { stations as mockStations } from "../../data/stations";
import type { Station as StationDto } from "../../types/station";
import { ENV } from "../../config/env";

type ListParams = {
  lat?: number;
  lng?: number;
  radius?: number; // A | B | C
};

// Map API response into our Station type if needed
function normalizeStation(s: any): StationDto {
  return {
    id: s.id, // Keep as is (can be UUID string or number)
    name: s.name,
    address: s.address,
    lat: parseFloat(s.lat ?? s.latitude ?? s.coordinates?.latitude ?? 0),
    lng: parseFloat(s.lng ?? s.longitude ?? s.coordinates?.longitude ?? 0),
    openHours:
      s.openHours ??
      `${s.operatingHours?.open ?? "07:00"} - ${
        s.operatingHours?.close ?? "21:00"
      }`,
    available: s.available ?? s.availableSlots ?? 0,
    capacity: s.capacity ?? s.totalSlots ?? 0,
    charging: s.charging ?? 0,
    maintenance: s.maintenance ?? 0,
    type: s.type ?? "station",
    rating: s.rating ?? undefined,
    distanceKm: s.distance_km ?? s.distanceKm ?? undefined,
    // Additional fields from API
    city: s.city ?? undefined,
    status: s.status ?? undefined,
    distance_m: s.distance_m ?? undefined,
    duration_seconds: s.duration_seconds ?? undefined,
    duration_minutes: s.duration_minutes ?? undefined,
  };
}

export async function listStations(
  params: ListParams = {}
): Promise<StationDto[]> {
  try {
    if (__DEV__) {
      console.log(
        "[StationService.listStations] calling GET /stations/nearby with params:",
        params
      );
    }

    const res = await api.get("/stations/nearby", { params });

    if (__DEV__) {
      console.log("[StationService.listStations] response:", res.data);
    }

    // Handle different response formats
    let items: any[] = [];

    if (Array.isArray(res.data)) {
      items = res.data;
    } else if (Array.isArray(res.data?.data)) {
      items = res.data.data;
    } else if (res.data?.data && typeof res.data.data === "object") {
      // Handle object with numeric keys like {"0": {...}, "1": {...}}
      items = Object.values(res.data.data);
    } else {
      items = [];
    }

    if (__DEV__) {
      console.log(
        "[StationService.listStations] parsed items count:",
        items.length
      );
    }

    return items.map(normalizeStation);
  } catch (e) {
    if (__DEV__) {
      console.log("[StationService.listStations] error, using mock data:", e);
    }
    if (true) {
      return mockStations.map((s) => ({ ...s }));
    }
    throw e;
  }
}

export async function getStationById(id: number | string): Promise<StationDto> {
  try {
    const res = await api.get(`/stations/${id}`);
    const data = res.data?.data ?? res.data;
    return normalizeStation(data);
  } catch (e) {
    if (1 < 2) {
      const found = mockStations.find((s) => String(s.id) === String(id));
      if (!found) throw e;
      return { ...found };
    }
    throw e;
  }
}

export async function reserveStation(
  id: number | string,
  payload: { vehicle_id: number | string; eta_minutes: number }
): Promise<{
  reservationId: string | number;
  reserved_at: string;
  expired_at: string;
}> {
  try {
    const res = await api.post(`/stations/${id}/reserve`, payload);
    const data = res.data?.data ?? res.data;
    return data;
  } catch (e) {
    if (1 < 2) {
      // Mock reservation success with short expiry for demo
      const now = new Date();
      const reserved_at = now.toISOString();
      const expired_at = new Date(now.getTime() + 2 * 60 * 1000).toISOString(); // 2 minutes demo
      return {
        reservationId: Math.floor(Math.random() * 100000),
        reserved_at,
        expired_at,
      };
    }
    throw e;
  }
}

// Backward-compatible class wrapper (if other parts import default)
class StationServiceCompat {
  async getNearbyStations(lat: number, lng: number, radius: number = 10) {
    const data = await listStations({ lat, lng, radius });
    return { success: true, data } as const;
  }
  async getStationById(stationId: string) {
    try {
      const data = await getStationById(stationId);
      return { success: true, data } as const;
    } catch {
      return {
        success: false as const,
        error: {
          code: "STATION_FETCH_FAILED",
          message: "Failed to fetch station details",
        },
      };
    }
  }
  async searchStations() {
    const data = await listStations({});
    return { success: true, data } as const;
  }
  async getStationAvailability(stationId: string, date: string) {
    const availableSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
    ]; // mock
    return { success: true, data: { availableSlots } } as const;
  }
}

export default new StationServiceCompat();
