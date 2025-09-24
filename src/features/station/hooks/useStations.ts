import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { listStations } from "../../../services/api/StationService";
import type { Station } from "../../../types/station";
import { distanceKm } from "../../../utils/geo";

export type StationFilters = {
  q?: string;
  distance_km?: number;
  battery_type?: string; // A | B | C
  sort?: "nearest" | "rating";
  enableDistanceCompute?: boolean; // compute distance client-side if missing
};

export function useStations(filters: StationFilters = {}) {
  return useQuery<Station[], Error>({
    queryKey: ["stations", filters],
    queryFn: async () => {
      const data = await listStations({
        q: filters.q,
        distance_km: filters.distance_km,
        battery_type: filters.battery_type,
      });

      // Client-side filter by battery_type if backend not supported
      let result = data;
      if (filters.battery_type) {
        result = result.filter(() => true); // placeholder if battery type is part of inventory later
      }

      // Optionally compute distance if not provided
      if (filters.enableDistanceCompute) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            result = result
              .map((s) => ({
                ...s,
                distanceKm: distanceKm(
                  loc.coords.latitude,
                  loc.coords.longitude,
                  s.lat,
                  s.lng
                ),
              }))
              .sort((a, b) =>
                filters.sort === "rating"
                  ? (b.rating || 0) - (a.rating || 0)
                  : (a.distanceKm || 0) - (b.distanceKm || 0)
              );
          }
        } catch {
          // ignore location errors
        }
      } else if (filters.sort === "rating") {
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return result;
    },
    staleTime: 60_000,
  });
}
