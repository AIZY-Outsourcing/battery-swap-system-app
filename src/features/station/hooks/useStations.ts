import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { listStations } from "../../../services/api/StationService";
import type { Station } from "../../../types/station";
import { distanceKm } from "../../../utils/geo";

export type StationFilters = {
  radius?: number; // km, default 100
  battery_type?: string; // filter by battery type if needed
  sort?: "nearest" | "rating";
};

export function useStations(filters: StationFilters = {}) {
  return useQuery<Station[], Error>({
    queryKey: ["stations", filters],
    queryFn: async () => {
      // Get user location first
      let userLat: number | undefined;
      let userLng: number | undefined;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          userLat = loc.coords.latitude;
          userLng = loc.coords.longitude;
        }
      } catch (error) {
        if (__DEV__) {
          console.log("[useStations] Failed to get location:", error);
        }
      }

      // Call API with lat/lng and radius
      const data = await listStations({
        lat: userLat,
        lng: userLng,
        radius: filters.radius || 100, // default 100km
      });

      // Client-side filter by battery_type if needed
      let result = data;
      if (filters.battery_type) {
        // Backend should handle this, but fallback to client-side if needed
        result = result.filter(() => true); // placeholder
      }

      // Sort by rating if requested (backend returns sorted by distance)
      if (filters.sort === "rating") {
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return result;
    },
    staleTime: 60_000,
  });
}
