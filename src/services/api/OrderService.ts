import { api } from "./index";
import { ApiResponse } from "../../types";

export interface CreateOrderPayload {
  type: "package" | "single";
  package_id?: string;
  quantity?: number;
}

export interface OrderHistoryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "pending" | "success" | "failed" | "cancelled";
  type?: "single" | "package";
}

export interface OrderHistoryResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  user_id: string;
  type: "package" | "single";
  package_id?: string;
  quantity?: number;
  total_amount: string | number;
  status: "pending" | "paid" | "cancelled" | "expired";
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_verified: boolean;
    is_2fa_enabled: boolean;
    vehicle?: {
      id: string;
      name: string;
      vin: string;
      plate_number: string;
      manufacturer_year: string;
      battery_type: {
        id: string;
        name: string;
        description: string;
      };
      vehicle_model: {
        id: string;
        name: string;
      };
    };
  };
  package?: {
    id: string;
    name: string;
    price: string;
    duration_days: number;
    quota_swaps: number;
    description: string;
  };
  payment?: {
    id: string;
    code: string;
    amount: string;
    status: string;
    content: string;
    qr_code: string;
    reference_code?: string;
    error_message?: string;
  };
  payment_info?: {
    bank_id: string;
    account_no: string;
    account_name: string;
    amount: string;
    description: string;
    qr_code: string;
  };
}

class OrderService {
  private baseUrl: string = "/orders";
  private static DEBUG: boolean =
    String(process.env.EXPO_PUBLIC_DEBUG_API_LOGS).toLowerCase() === "true" ||
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV !== "production";

  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    try {
      if (OrderService.DEBUG) {
        console.log("[order] ⇢ POST", `${this.baseUrl}`, payload);
      }

      const response = await api.post(this.baseUrl, payload);
      
      if (OrderService.DEBUG) {
        console.log("[order] ⇠ POST", `${this.baseUrl}`, "→", response.status);
      }

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      if (OrderService.DEBUG) {
        console.error("[order] POST error:", error);
      }
      
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to create order",
        },
      };
    }
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const url = `${this.baseUrl}/${orderId}`;

      console.log("🔍 [OrderService] GET order:", url);
      console.log("🔍 [OrderService] Order ID:", orderId);

      const response = await api.get(url);
      
      console.log("✅ [OrderService] GET response:", response.status);
      console.log("📦 [OrderService] Response data:", response.data);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("❌ [OrderService] GET error:", error);
      console.error("❌ [OrderService] Error response:", error.response?.data);
      
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to fetch order",
        },
      };
    }
  }

  async getOrderHistory(params: OrderHistoryParams = {}): Promise<ApiResponse<OrderHistoryResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.status) queryParams.append("status", params.status);
      if (params.type) queryParams.append("type", params.type);

      const url = `/orders/me/history${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      console.log("🔍 [OrderService] GET order history:", url);
      console.log("🔍 [OrderService] Params:", params);

      const response = await api.get(url);

      console.log("✅ [OrderService] GET history response:", response.status);
      console.log("📦 [OrderService] History response data:", response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("❌ [OrderService] GET history error:", error);
      console.error("❌ [OrderService] Error response:", error.response?.data);

      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to fetch order history",
        },
      };
    }
  }
}

export const orderService = new OrderService();
export default orderService;
