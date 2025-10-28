import { api } from "../api";
import { ApiResponse } from "./types";

export interface LatestSwapCredit {
  total_credits: number;
  used_credits: number;
  status: string;
  expiration_at: string;
  created_at: string;
}

export interface ActiveSubscriptionPackage {
  id: string;
  name: string;
  price: string;
  quota_swaps: number;
  duration_days: number;
  description: string;
  start_date: string;
  end_date: string;
  remaining_quota_swaps: number;
}

export interface SwapCredits {
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
  total_subscriptions: number;
  total_remaining_quota_swaps: number;
  latest_swap_credit: LatestSwapCredit;
  active_subscription_packages: ActiveSubscriptionPackage[];
}

class SwapCreditsService {
  private baseUrl = "/user-swap-credits/me";

  async getMySwapCredits(): Promise<ApiResponse<SwapCredits>> {
    try {
      console.log("🔍 [SwapCreditsService] GET my swap credits:", this.baseUrl);

      const response = await api.get(this.baseUrl);

      console.log("✅ [SwapCreditsService] GET response:", response.status);
      console.log("📦 [SwapCreditsService] Response data:", response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("❌ [SwapCreditsService] GET error:", error);
      console.error("❌ [SwapCreditsService] Error response:", error.response?.data);

      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message || "Failed to fetch swap credits",
        },
      };
    }
  }
}

export const swapCreditsService = new SwapCreditsService();
