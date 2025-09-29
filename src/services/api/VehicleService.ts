import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from ".";
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
}

// Payload for creation (user_id optional; will be auto injected if missing)
export interface CreateVehiclePayload {
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year: string;
  user_id?: string; // optional, derive from stored user if absent
  battery_type_id: string;
}

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
    const userId = await resolveUserId(payload.user_id);
    if (!userId) {
      return {
        success: false,
        error: {
          code: "NO_USER_ID",
          message: "User id missing (login required)",
        },
      };
    }
    const body = { ...payload, user_id: userId };
    const res = await api.post("/vehicles", body);
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
    // Merge into stored user.vehicle if structure expects single vehicle
    try {
      const raw = await AsyncStorage.getItem("BSS_USER_DATA");
      if (raw) {
        const user = JSON.parse(raw);
        user.vehicle = {
          make: payload.name,
          model: payload.name,
          year: payload.manufacturer_year,
          licensePlate: payload.plate_number,
          batteryType: payload.battery_type_id,
        };
        await AsyncStorage.setItem("BSS_USER_DATA", JSON.stringify(user));
      }
    } catch {}
  }
  return result;
}

export default {
  createVehicle,
  createVehicleAndStore,
};
