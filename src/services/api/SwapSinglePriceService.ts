import { api } from "./index";
import { ApiResponse } from "../../types";

export interface SwapSinglePrice {
  id: string;
  min_quantity: number;
  max_quantity: number;
  price: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

class SwapSinglePriceService {
  private baseUrl: string = "/swap-single-prices";
  private static DEBUG: boolean =
    String(process.env.EXPO_PUBLIC_DEBUG_API_LOGS).toLowerCase() === "true" ||
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV !== "production";

  /**
   * Get all active swap single prices
   */
  async getAll(): Promise<ApiResponse<SwapSinglePrice[]>> {
    try {
      if (SwapSinglePriceService.DEBUG) {
        console.log("[swap-single-price] ⇢ GET", `${this.baseUrl}`);
      }

      const response = await api.get(this.baseUrl);

      if (SwapSinglePriceService.DEBUG) {
        console.log(
          "[swap-single-price] ⇠ GET",
          `${this.baseUrl}`,
          "→",
          response.status
        );
      }

      // Handle response - BE returns object with numeric keys, convert to array
      let pricesData = response.data.data || response.data;

      // If response is an object (not array), convert to array
      if (
        pricesData &&
        typeof pricesData === "object" &&
        !Array.isArray(pricesData)
      ) {
        pricesData = Object.values(pricesData);
      }

      // Convert price from string to number
      if (Array.isArray(pricesData)) {
        pricesData = pricesData.map((item: any) => ({
          ...item,
          price:
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price,
        }));
      }

      return {
        success: true,
        data: pricesData as SwapSinglePrice[],
      };
    } catch (error: any) {
      if (SwapSinglePriceService.DEBUG) {
        console.error("[swap-single-price] GET error:", error);
      }

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch swap prices",
      };
    }
  }

  /**
   * Get price for a specific quantity
   * @param quantity - Number of swaps to purchase
   */
  async getPriceByQuantity(
    quantity: number
  ): Promise<ApiResponse<SwapSinglePrice>> {
    try {
      const result = await this.getAll();

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || {
            code: "FETCH_ERROR",
            message: "Failed to fetch prices",
          },
        };
      }

      // Find the price tier that matches the quantity
      const priceInfo = result.data.find(
        (price) =>
          price.status === "active" &&
          price.min_quantity <= quantity &&
          (price.max_quantity === null || price.max_quantity >= quantity)
      );

      if (!priceInfo) {
        return {
          success: false,
          error: {
            code: "PRICE_NOT_FOUND",
            message: `No pricing available for quantity ${quantity}`,
          },
        };
      }

      return {
        success: true,
        data: priceInfo,
      };
    } catch (error: any) {
      if (SwapSinglePriceService.DEBUG) {
        console.error("[swap-single-price] getPriceByQuantity error:", error);
      }

      return {
        success: false,
        error: error.message || "Failed to calculate price",
      };
    }
  }
}

export const swapSinglePriceService = new SwapSinglePriceService();
