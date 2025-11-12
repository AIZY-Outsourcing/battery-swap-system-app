import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./index";
import { ApiResponse, User } from "../../types";

// Backend vehicle raw shape (based on spec)
export interface BackendVehicle {
  id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  created_by?: string;
  updated_by?: string;
  name: string; // e.g. model or label ("Vento S")
  vin: string;
  plate_number: string;
  manufacturer_year: string; // backend uses string
  user_id: string;
  battery_type_id: string;
  vehicle_model_id?: string;
}

// Payload for creation (user_id optional; will be auto injected if missing)
export interface CreateVehiclePayload {
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year: string;
  user_id?: string; // optional, derive from stored user if absent
  battery_type_id: string;
  vehicle_model_id: string;
}

// Options response types
export type VehicleModelOptions = Record<string, string>;
export type BatteryTypeOptions = Record<string, string>;

// Normalized internal vehicle shape (aligned with existing Vehicle concept but minimal)
export interface VehicleRecord {
  id: string;
  name: string;
  vin: string;
  plateNumber: string;
  year: string;
  userId: string;
  batteryTypeId: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalize(v: BackendVehicle): VehicleRecord {
  return {
    id: v.id,
    name: v.name,
    vin: v.vin,
    plateNumber: v.plate_number,
    year: v.manufacturer_year,
    userId: v.user_id,
    batteryTypeId: v.battery_type_id,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}

async function resolveUserId(provided?: string): Promise<string | undefined> {
  if (provided) return provided;
  try {
    const raw = await AsyncStorage.getItem("BSS_USER_DATA");
    if (!raw) return undefined;
    const user = JSON.parse(raw) as User & { id?: string };
    return user.id;
  } catch {
    return undefined;
  }
}

export async function createVehicle(
  payload: CreateVehiclePayload
): Promise<ApiResponse<VehicleRecord>> {
  try {
    // Backend auto-derives user_id from token, so don't send it
    const { ...body } = payload;

    if (__DEV__) {
      console.log(
        "[VehicleService.createVehicle] calling POST /vehicles with:",
        body
      );
    }

    const res = await api.post("/vehicles", body);

    if (__DEV__) {
      console.log("[VehicleService.createVehicle] success response:", res.data);
    }

    // API returns vehicle directly in response (not nested in data wrapper)
    const data: BackendVehicle = res.data as BackendVehicle;
    return { success: true, data: normalize(data) };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to create vehicle";

    if (__DEV__) {
      console.log("[VehicleService.createVehicle] failure", {
        status,
        respData,
        originalPayload: payload,
        errorMessage: error?.message,
        errorCode: error?.code,
        isNetworkError:
          error?.message?.includes("Network") || error?.code === "ECONNREFUSED",
      });
    }

    let code = "VEHICLE_CREATE_FAILED";
    if (status === 400) code = "VEHICLE_CREATE_INVALID";
    return {
      success: false,
      error: { code, message },
    };
  }
}

// Optional helper to adapt existing local vehicle saving logic
export async function createVehicleAndStore(
  payload: CreateVehiclePayload
): Promise<ApiResponse<VehicleRecord>> {
  const result = await createVehicle(payload);
  if (result.success && result.data) {
    // Store the actual vehicle data returned from API
    try {
      const raw = await AsyncStorage.getItem("BSS_USER_DATA");
      if (raw) {
        const user = JSON.parse(raw);

        // Use the original payload name since backend might not return it properly
        const vehicleName = result.data.name || payload.name || "Xe điệnnn";

        // Convert VehicleRecord to User vehicle format
        const vehicleData = {
          id: result.data.id,
          make: vehicleName.split(" ")[0] || "Unknown", // Extract make from name
          model: vehicleName, // Use the full name as model
          year: result.data.year || new Date().getFullYear().toString(),
          licensePlate: result.data.plateNumber || "",
          vin: result.data.vin || "",
          batteryType: result.data.batteryTypeId || "",
        };

        // Add to vehicles array if it exists, otherwise create it
        if (!user.vehicles) {
          user.vehicles = [];
        }
        user.vehicles.push(vehicleData);

        // Also keep the legacy vehicle field for backward compatibility
        user.vehicle = vehicleData;

        await AsyncStorage.setItem("BSS_USER_DATA", JSON.stringify(user));

        if (__DEV__) {
          console.log("[VehicleService] Saved vehicle to user:", {
            vehicleId: result.data.id,
            name: vehicleName,
            vehicleData: vehicleData,
            vehiclesCount: user.vehicles.length,
          });
        }
      }
    } catch (error) {
      console.error("[VehicleService] Failed to save vehicle to user:", error);
    }
  }
  return result;
}

/**
 * Fetch vehicle model options for dropdown
 * GET /vehicle-models/options
 */
export async function getVehicleModelOptions(): Promise<
  ApiResponse<VehicleModelOptions>
> {
  try {
    const res = await api.get("/vehicle-models/options");

    if (__DEV__) {
      console.log(
        "[VehicleService.getVehicleModelOptions] raw response:",
        JSON.stringify(res.data, null, 2)
      );
    }

    // Handle nested response structure like {data: {success, data: {...}}}
    const body = res.data?.data?.data ?? res.data?.data ?? res.data;
    const data: VehicleModelOptions = body || {};

    if (__DEV__) {
      console.log(
        "[VehicleService.getVehicleModelOptions] parsed options:",
        Object.keys(data).length,
        "items"
      );
      console.log(
        "[VehicleService.getVehicleModelOptions] options detail:",
        JSON.stringify(data, null, 2)
      );
    }

    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to fetch vehicle models";
    if (__DEV__) {
      console.log("[VehicleService.getVehicleModelOptions] failure", {
        status,
        respData,
      });
    }
    return {
      success: false,
      error: { code: "FETCH_MODELS_FAILED", message },
    };
  }
}

/**
 * Fetch battery type options for dropdown
 * GET /battery-types/options
 */
export async function getBatteryTypeOptions(): Promise<
  ApiResponse<BatteryTypeOptions>
> {
  try {
    const res = await api.get("/battery-types/options");

    if (__DEV__) {
      console.log(
        "[VehicleService.getBatteryTypeOptions] raw response:",
        JSON.stringify(res.data, null, 2)
      );
    }

    // Handle nested response structure like {data: {success, data: {...}}}
    const body = res.data?.data?.data ?? res.data?.data ?? res.data;
    const data: BatteryTypeOptions = body || {};

    if (__DEV__) {
      console.log(
        "[VehicleService.getBatteryTypeOptions] parsed options:",
        Object.keys(data).length,
        "items"
      );
      console.log(
        "[VehicleService.getBatteryTypeOptions] options detail:",
        JSON.stringify(data, null, 2)
      );
    }

    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to fetch battery types";
    if (__DEV__) {
      console.log("[VehicleService.getBatteryTypeOptions] failure", {
        status,
        respData,
      });
    }
    return {
      success: false,
      error: { code: "FETCH_BATTERY_TYPES_FAILED", message },
    };
  }
}

/**
 * Get list of vehicles for current user
 * GET /vehicles/me
 */
export async function getMyVehicles(): Promise<ApiResponse<BackendVehicle[]>> {
  try {
    if (__DEV__) {
      console.log("[VehicleService.getMyVehicles] calling GET /vehicles/me");
    }

    const res = await api.get("/vehicles/me");

    if (__DEV__) {
      console.log("[VehicleService.getMyVehicles] success response:", res.data);
    }

    // Handle nested response structure
    const body = res.data?.data?.data ?? res.data?.data ?? res.data;

    // Backend returns object with numeric keys {"1": {...}, "2": {...}}
    // Convert to array
    let data: BackendVehicle[] = [];
    if (Array.isArray(body)) {
      data = body;
    } else if (body && typeof body === "object") {
      // Convert object to array
      data = Object.values(body);
    }

    if (__DEV__) {
      console.log(
        "[VehicleService.getMyVehicles] parsed vehicles:",
        data.length,
        "items"
      );
    }

    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to fetch vehicles";

    if (__DEV__) {
      console.log("[VehicleService.getMyVehicles] failure", {
        status,
        respData,
      });
    }

    return {
      success: false,
      error: { code: "FETCH_VEHICLES_FAILED", message },
    };
  }
}

/**
 * Get vehicle details by ID
 * GET /vehicles/:id
 */
export async function getVehicleById(
  vehicleId: string
): Promise<ApiResponse<BackendVehicle>> {
  try {
    if (__DEV__) {
      console.log(
        `[VehicleService.getVehicleById] calling GET /vehicles/${vehicleId}`
      );
    }

    const res = await api.get(`/vehicles/${vehicleId}`);

    if (__DEV__) {
      console.log(
        "[VehicleService.getVehicleById] success response:",
        res.data
      );
    }

    const body = res.data?.data?.data ?? res.data?.data ?? res.data;
    const data: BackendVehicle = body;

    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to fetch vehicle";

    if (__DEV__) {
      console.log("[VehicleService.getVehicleById] failure", {
        status,
        respData,
      });
    }

    let code = "FETCH_VEHICLE_FAILED";
    if (status === 404) code = "VEHICLE_NOT_FOUND";
    return {
      success: false,
      error: { code, message },
    };
  }
}

/**
 * Update vehicle
 * PUT /vehicles/:id
 */
export async function updateVehicle(
  vehicleId: string,
  payload: Partial<CreateVehiclePayload>
): Promise<ApiResponse<BackendVehicle>> {
  try {
    if (__DEV__) {
      console.log(
        `[VehicleService.updateVehicle] calling PUT /vehicles/${vehicleId}`,
        payload
      );
    }

    const res = await api.put(`/vehicles/${vehicleId}`, payload);

    if (__DEV__) {
      console.log("[VehicleService.updateVehicle] success response:", res.data);
    }

    const data: BackendVehicle = res.data as BackendVehicle;
    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to update vehicle";

    if (__DEV__) {
      console.log("[VehicleService.updateVehicle] failure", {
        status,
        respData,
      });
    }

    let code = "VEHICLE_UPDATE_FAILED";
    if (status === 400) code = "VEHICLE_UPDATE_INVALID";
    if (status === 404) code = "VEHICLE_NOT_FOUND";
    return {
      success: false,
      error: { code, message },
    };
  }
}

/**
 * Delete vehicle
 * DELETE /vehicles/:id
 */
export async function deleteVehicle(
  vehicleId: string
): Promise<ApiResponse<void>> {
  try {
    if (__DEV__) {
      console.log(
        `[VehicleService.deleteVehicle] calling DELETE /vehicles/${vehicleId}`
      );
    }

    await api.delete(`/vehicles/${vehicleId}`);

    if (__DEV__) {
      console.log("[VehicleService.deleteVehicle] success");
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    const status = error?.response?.status;
    const respData = error?.response?.data;
    const message =
      respData?.message || respData?.error || "Failed to delete vehicle";

    if (__DEV__) {
      console.log("[VehicleService.deleteVehicle] failure", {
        status,
        respData,
      });
    }

    let code = "VEHICLE_DELETE_FAILED";
    if (status === 404) code = "VEHICLE_NOT_FOUND";
    return {
      success: false,
      error: { code, message },
    };
  }
}

export default {
  createVehicle,
  createVehicleAndStore,
  getVehicleModelOptions,
  getBatteryTypeOptions,
};
