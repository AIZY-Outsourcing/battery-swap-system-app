import { api } from "../api";
import { ApiResponse } from "./types";

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  deleted_at: string | null;
  order_id: string;
  user_id: string;
  code: string;
  amount: string;
  status: "success" | "pending" | "failed" | "cancelled";
  content: string;
  qr_code: string;
  reference_code: string | null;
  error_message: string | null;
  order: {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    deleted_at: string | null;
    user_id: string;
    type: "package" | "single";
    package_id: string | null;
    quantity: number;
    total_amount: string;
    status: "success" | "pending" | "failed" | "cancelled";
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      is_verified: boolean;
      is_2fa_enabled: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      vehicle: {
        id: string;
        created_at: string;
        updated_at: string;
        created_by: string;
        updated_by: string | null;
        deleted_at: string | null;
        name: string;
        vin: string;
        plate_number: string;
        manufacturer_year: string;
        user_id: string;
        battery_type_id: string;
        vehicle_model_id: string;
        battery_type: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          name: string;
          description: string;
        };
        vehicle_model: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
          name: string;
          battery_type_id: string;
        };
      };
    };
    package: {
      id: string;
      created_at: string;
      updated_at: string;
      created_by: string | null;
      updated_by: string | null;
      deleted_at: string | null;
      name: string;
      price: string;
      quota_swaps: number;
      duration_days: number;
      description: string;
    } | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_verified: boolean;
    is_2fa_enabled: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    vehicle: {
      id: string;
      created_at: string;
      updated_at: string;
      created_by: string;
      updated_by: string | null;
      deleted_at: string | null;
      name: string;
      vin: string;
      plate_number: string;
      manufacturer_year: string;
      user_id: string;
      battery_type_id: string;
      vehicle_model_id: string;
      battery_type: {
        id: string;
        created_at: string;
        updated_at: string;
        created_by: string | null;
        updated_by: string | null;
        deleted_at: string | null;
        name: string;
        description: string;
      };
      vehicle_model: {
        id: string;
        created_at: string;
        updated_at: string;
        created_by: string | null;
        updated_by: string | null;
        deleted_at: string | null;
        name: string;
        battery_type_id: string;
      };
    };
  };
}

export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class PaymentService {
  private baseUrl = "/api/v1/payments";

  async getPayments(params: PaymentListParams = {}): Promise<ApiResponse<PaymentListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      console.log("🔍 [PaymentService] GET payments:", url);
      console.log("🔍 [PaymentService] Params:", params);

      const response = await api.get(url);

      console.log("✅ [PaymentService] GET response:", response.status);
      console.log("📦 [PaymentService] Response data:", response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("❌ [PaymentService] GET error:", error);
      console.error("❌ [PaymentService] Error response:", error.response?.data);

      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to fetch payments",
        },
      };
    }
  }
}

export const paymentService = new PaymentService();
