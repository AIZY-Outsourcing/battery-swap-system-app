import { api } from "./index";

export interface Reservation {
  id: string;
  station_id: string;
  user_id: string;
  battery_id: string;
  reservation_at: string;
  expiration_at: string;
  status: "pending" | "confirmed" | "cancelled" | "expired" | "completed";
  checkin_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  station?: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  battery?: {
    id: string;
    battery_type_id: string;
    soc: number;
    soh: number;
  };
}

export interface CreateReservationDto {
  station_id: string;
  vehicle_id?: string;
  duration_minutes?: number; // 30-120 minutes, default 30
}

class ReservationService {
  /**
   * Create a new reservation
   */
  async createReservation(
    data: CreateReservationDto
  ): Promise<{ data: Reservation }> {
    const response = await api.post<{ data: Reservation }>(
      "/reservations",
      data
    );
    return response.data;
  }

  /**
   * Get all reservations for current user
   */
  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get<{ data: Reservation[] | {} }>(
      "/reservations/me"
    );
    // Backend may return empty object {} or object with numeric keys instead of array
    const data = response.data.data;

    if (Array.isArray(data)) {
      return data;
    }

    // Handle object with numeric keys (e.g., {0: {...}, 1: {...}})
    if (data && typeof data === "object") {
      const values = Object.values(data);
      if (values.length > 0 && typeof values[0] === "object") {
        return values as Reservation[];
      }
    }

    return [];
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(
    reservationId: string
  ): Promise<{ data: Reservation }> {
    const response = await api.patch<{ data: Reservation }>(
      `/reservations/${reservationId}/cancel`
    );
    return response.data;
  }
}

export default new ReservationService();
