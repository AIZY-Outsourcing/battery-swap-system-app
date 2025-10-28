import { api } from "./index";
import { ApiResponse } from "../../types";

export interface SubscriptionPackage {
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
}

export interface SubscriptionPackagesResponse {
  data: SubscriptionPackage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriptionPackagesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class SubscriptionService {
  private baseUrl: string = "/subscription-packages";
  private static DEBUG: boolean =
    String(process.env.EXPO_PUBLIC_DEBUG_API_LOGS).toLowerCase() === "true" ||
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV !== "production";

  async getSubscriptionPackages(
    params: SubscriptionPackagesParams = {}
  ): Promise<ApiResponse<SubscriptionPackagesResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      if (SubscriptionService.DEBUG) {
        console.log("[subscription] ⇢ GET", url);
      }

      const response = await api.get(url);
      
      if (SubscriptionService.DEBUG) {
        console.log("[subscription] ⇠ GET", url, "→", response.status);
      }

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      if (SubscriptionService.DEBUG) {
        console.error("[subscription] GET error:", error);
      }
      
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to fetch subscription packages",
        },
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
