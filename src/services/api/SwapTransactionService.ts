import { api } from "./index";

export interface SwapTransaction {
  id: string;
  swap_order_id: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  message?: string;
  created_at: string;
  updated_at: string;
  swap_order?: {
    id: string;
    station_id: string;
    user_id: string;
    old_battery_id?: string;
    new_battery_id?: string;
    status: string;
    completed_at?: string;
    created_at: string;
    station?: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    old_battery?: {
      id: string;
      soc: number;
      soh: number;
    };
    new_battery?: {
      id: string;
      soc: number;
      soh: number;
    };
  };
}

class SwapTransactionService {
  /**
   * Get all swap transactions for current user
   */
  async getMySwapTransactions(): Promise<SwapTransaction[]> {
    const response = await api.get<{ data: SwapTransaction[] | {} }>(
      "/swap-transactions/me"
    );

    // Handle nested data structure
    const data = (response.data as any)?.data || response.data;

    // Handle object with numeric keys (e.g., {0: {...}, 1: {...}})
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const values = Object.values(data);
      if (values.length > 0 && typeof values[0] === "object") {
        return values as SwapTransaction[];
      }
    }

    // Handle array response
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }
}

export default new SwapTransactionService();
