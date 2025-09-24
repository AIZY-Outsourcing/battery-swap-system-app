import { api } from ".";
import { stations as mockStations } from "../../data/stations";
import type { Station as StationDto } from "../../types/station";

type ListParams = {
  q?: string;
  distance_km?: number;
  battery_type?: string; // A | B | C
};

// Map API response into our Station type if needed
function normalizeStation(s: any): StationDto {
  return {
    id: Number(s.id),
    name: s.name,
    address: s.address,
    lat: s.lat ?? s.latitude ?? s.coordinates?.latitude ?? 0,
    lng: s.lng ?? s.longitude ?? s.coordinates?.longitude ?? 0,
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
    distanceKm: s.distanceKm ?? undefined,
  };
}

export async function listStations(
  params: ListParams = {}
): Promise<StationDto[]> {
  try {
    const res = await api.get("/stations", { params });
    const items = Array.isArray(res.data) ? res.data : res.data?.data || [];
    return items.map(normalizeStation);
  } catch (e) {
    // Fallback to mock
    return mockStations.map((s) => ({ ...s }));
  }
}

export async function getStationById(id: number | string): Promise<StationDto> {
  try {
    const res = await api.get(`/stations/${id}`);
    const data = res.data?.data ?? res.data;
    return normalizeStation(data);
  } catch (e) {
    const found = mockStations.find((s) => String(s.id) === String(id));
    if (!found) throw e;
    return { ...found };
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
}

// Backward-compatible class wrapper (if other parts import default)
class StationServiceCompat {
  async getNearbyStations(lat: number, lng: number, radius: number = 10) {
    const data = await listStations({ distance_km: radius });
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
  async searchStations(query: string) {
    const data = await listStations({ q: query });
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
