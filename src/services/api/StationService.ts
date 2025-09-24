import { ApiResponse, Station } from "../../types";

const API_BASE_URL = "https://api.bss-app.com"; // Replace with actual API URL

class StationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/stations`;
  }

  async getNearbyStations(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<ApiResponse<Station[]>> {
    try {
      // TODO: Implement actual API call
      // const response = await fetch(
      //   `${this.baseUrl}/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      // );
      // return await response.json();

      // Mock data for now
      const mockStations: Station[] = [
        {
          id: "1",
          name: "Downtown Station",
          address: "123 Main St, Downtown",
          coordinates: { latitude: 40.7128, longitude: -74.006 },
          distance: "0.5 km",
          availableSlots: 3,
          totalSlots: 6,
          status: "available",
          amenities: ["WiFi", "Coffee", "Restroom"],
          operatingHours: { open: "06:00", close: "22:00" },
        },
        {
          id: "2",
          name: "Mall Station",
          address: "456 Shopping Center",
          coordinates: { latitude: 40.7589, longitude: -73.9851 },
          distance: "1.2 km",
          availableSlots: 0,
          totalSlots: 4,
          status: "busy",
          amenities: ["WiFi", "Shopping"],
          operatingHours: { open: "08:00", close: "20:00" },
        },
      ];

      return {
        success: true,
        data: mockStations,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "STATIONS_FETCH_FAILED",
          message: "Failed to fetch nearby stations",
        },
      };
    }
  }

  async getStationById(stationId: string): Promise<ApiResponse<Station>> {
    try {
      // TODO: Implement actual API call
      const mockStation: Station = {
        id: stationId,
        name: "Downtown Station",
        address: "123 Main St, Downtown",
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        distance: "0.5 km",
        availableSlots: 3,
        totalSlots: 6,
        status: "available",
        amenities: ["WiFi", "Coffee", "Restroom"],
        operatingHours: { open: "06:00", close: "22:00" },
      };

      return {
        success: true,
        data: mockStation,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "STATION_FETCH_FAILED",
          message: "Failed to fetch station details",
        },
      };
    }
  }

  async searchStations(query: string): Promise<ApiResponse<Station[]>> {
    try {
      // TODO: Implement actual API call
      const mockStations: Station[] = [
        {
          id: "1",
          name: "Downtown Station",
          address: "123 Main St, Downtown",
          coordinates: { latitude: 40.7128, longitude: -74.006 },
          availableSlots: 3,
          totalSlots: 6,
          status: "available",
          amenities: ["WiFi", "Coffee", "Restroom"],
          operatingHours: { open: "06:00", close: "22:00" },
        },
      ];

      return {
        success: true,
        data: mockStations.filter(
          (station) =>
            station.name.toLowerCase().includes(query.toLowerCase()) ||
            station.address.toLowerCase().includes(query.toLowerCase())
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "STATIONS_SEARCH_FAILED",
          message: "Failed to search stations",
        },
      };
    }
  }

  async getStationAvailability(
    stationId: string,
    date: string
  ): Promise<ApiResponse<{ availableSlots: string[] }>> {
    try {
      // TODO: Implement actual API call
      const mockSlots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
      ];

      return {
        success: true,
        data: { availableSlots: mockSlots },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "AVAILABILITY_FETCH_FAILED",
          message: "Failed to fetch station availability",
        },
      };
    }
  }
}

export default new StationService();
