import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, LoginForm, RegisterForm, User } from "../../types";
import {
  api,
  clearSecureToken,
  getSecureToken,
  setSecureToken,
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
} from "../api";

class AuthService {
  private baseUrl: string = "/auth"; // base without version (ENV adds version already)
  // Debug flag aligns with API client logging behavior
  private static DEBUG: boolean =
    String(process.env.EXPO_PUBLIC_DEBUG_API_LOGS).toLowerCase() === "true" ||
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV !== "production";

  async login(
    credentials: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Backend expects emailOrPhone field
      const payload = {
        emailOrPhone: credentials.email, // LoginForm.email can be email or phone
        password: credentials.password,
      };
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/login`, {
          emailOrPhone: payload.emailOrPhone,
          password: "***",
        });
      }
      const res = await api.post(`${this.baseUrl}/login`, payload);
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇠ POST", `${this.baseUrl}/login`, "→", res.status);
      }
      const body: any = res.data;
      const root: any = body?.data?.data ?? body?.data ?? body;

      const apiUser: any =
        root?.user || root?.profile || root?.account || root?.data?.user || {};

      // Map API user -> local User shape
      const splitName = (apiUser.name || "").trim().split(/\s+/);
      const user: User = {
        id: apiUser.id || "user_" + Date.now(),
        firstName: splitName.slice(0, -1).join(" ") || splitName[0] || "",
        lastName: splitName.slice(-1).join(" ") || "",
        email: apiUser.email || credentials.email,
        phone: apiUser.phone || "",
        createdAt: apiUser.createdAt || new Date().toISOString(),
        membershipLevel: apiUser.membershipLevel || "bronze",
        emailVerified: apiUser.is_verified || false,
        role: apiUser.role || "user",
      } as User;

      const tokens: any = root?.tokens || root?.data?.tokens || {};
      const access = tokens?.access_token || root?.access_token || root?.token;
      const refresh = tokens?.refresh_token || root?.refresh_token;
      if (access) await setSecureToken(access);
      if (refresh) await setRefreshToken(refresh);

      // Attach vehicles array if returned by backend
      const vehicles = root?.vehicles ?? [];
      if (vehicles && vehicles.length > 0) {
        // Store vehicles array and also set the first vehicle as primary for backward compatibility
        try {
          (user as any).vehicles = vehicles;
          (user as any).vehicle = vehicles[0];
        } catch {}
      }

      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      // Determine if PIN (2FA) setup or vehicle setup is required
      const is2faEnabled =
        apiUser.is_2fa_enabled ?? root?.requires_2fa ?? false;
      const needsPinSetup = is2faEnabled === false;
      const needsVehicleSetup = !vehicles || vehicles.length === 0;

      return {
        success: true,
        data: { token: access, user, needsPinSetup, needsVehicleSetup },
      } as any;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Invalid credentials";
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ✖ POST",
          `${this.baseUrl}/login`,
          status || "NETWORK",
          {
            message,
            response: error?.response?.data,
          }
        );
      }
      return {
        success: false,
        error: {
          code: status === 401 ? "INVALID_CREDENTIALS" : "LOGIN_FAILED",
          message,
        },
      };
    }
  }

  async register(
    userData: RegisterForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Backend expects a single 'name' field
      const name = `${userData.firstName || ""} ${
        userData.lastName || ""
      }`.trim();
      // Payload per spec
      const payload = {
        name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      };
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/signup`, {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: "***",
        });
      }
      const res = await api.post(`${this.baseUrl}/signup`, payload);
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇠ POST", `${this.baseUrl}/signup`, "→", res.status);
      }
      const body: any = res.data;
      const root: any = body?.data?.data ?? body?.data ?? body;
      const apiUser: any =
        root?.user || root?.profile || root?.account || root?.data?.user || {};
      // Map API user (id, email, name) -> local User shape
      const splitName = (apiUser.name || name || "").trim().split(/\s+/);
      const firstName =
        apiUser.firstName ||
        splitName.slice(0, -1).join(" ") ||
        splitName[0] ||
        "";
      const lastName = apiUser.lastName || splitName.slice(-1).join(" ") || "";
      const user: User = {
        id: apiUser.id || apiUser.user_id || "user_" + Date.now(),
        firstName,
        lastName,
        email: apiUser.email || userData.email,
        phone: apiUser.phone || userData.phone,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        membershipLevel: apiUser.membershipLevel || "bronze",
        emailVerified: apiUser.is_verified || false,
        role: apiUser.role || "user",
      } as User;
      const tokens: any = root?.tokens || root?.data?.tokens || {};
      const access = tokens?.access_token || root?.access_token || root?.token;
      const refresh = tokens?.refresh_token || root?.refresh_token;
      if (access) await setSecureToken(access);
      if (refresh) await setRefreshToken(refresh);

      // Attach vehicles array if returned by backend
      const vehicles = root?.vehicles ?? [];
      if (vehicles && vehicles.length > 0) {
        try {
          (user as any).vehicles = vehicles;
          (user as any).vehicle = vehicles[0];
        } catch {}
      }

      if (user)
        await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      return { success: true, data: { token: access, user } } as any;
    } catch (error: any) {
      const status = error?.response?.status;
      const respData = error?.response?.data;
      const backendMessage =
        respData?.message || respData?.error || respData?.detail;
      const validationMsg = Array.isArray(respData?.errors)
        ? respData.errors.map((e: any) => e.message || e).join("; ")
        : undefined;
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[AuthService.register] failure", {
          status,
          respData,
          backendMessage,
          validationMsg,
        });
      }
      let code = "REGISTRATION_FAILED";
      if (status === 409) code = "USER_EXISTS";
      else if (status === 400 || status === 422) code = "REGISTRATION_INVALID";
      return {
        success: false,
        error: {
          code,
          message: validationMsg || backendMessage || "Registration failed",
        },
      };
    }
  }

  async logout(): Promise<ApiResponse<{}>> {
    try {
      // Attempt server-side logout (best-effort; ignore failure)
      try {
        if (AuthService.DEBUG) {
          // eslint-disable-next-line no-console
          console.log("[auth] ⇢ POST", `${this.baseUrl}/logout`);
        }
        await api.post(`${this.baseUrl}/logout`);
        if (AuthService.DEBUG) {
          // eslint-disable-next-line no-console
          console.log("[auth] ⇠ POST", `${this.baseUrl}/logout`, "→ ok");
        }
      } catch {}
      await clearSecureToken();
      await clearRefreshToken();
      await AsyncStorage.removeItem(AuthService.USER_KEY);
      return { success: true, data: {} };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "LOGOUT_FAILED",
          message: "Logout failed",
        },
      };
    }
  }

  async refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
    try {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/refresh`, {
          refresh_token: "***",
        });
      }
      const res = await api.post(`${this.baseUrl}/refresh`, {
        refresh_token: token,
      });
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ⇠ POST",
          `${this.baseUrl}/refresh`,
          "→",
          res.status
        );
      }
      const data = res.data?.data || res.data;
      const newAccess = data.access_token;
      const newRefresh = data.refresh_token;
      if (newAccess) await setSecureToken(newAccess);
      if (newRefresh) await setRefreshToken(newRefresh);
      return { success: true, data: { token: newAccess } };
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Token refresh failed";
      return {
        success: false,
        error: {
          code:
            status === 401 ? "INVALID_REFRESH_TOKEN" : "TOKEN_REFRESH_FAILED",
          message,
        },
      };
    }
  }

  // New methods for real auth flow
  private static TOKEN_KEY = "BSS_AUTH_TOKEN";
  private static USER_KEY = "BSS_USER_DATA";

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await getSecureToken();
      const user = await AsyncStorage.getItem(AuthService.USER_KEY);
      return !!(token && user);
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      console.log(
        "🔍 [AuthService.getCurrentUser] Retrieved from AsyncStorage:",
        {
          key: AuthService.USER_KEY,
          hasData: !!userData,
          dataLength: userData?.length || 0,
        }
      );
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("⚠️ [AuthService.getCurrentUser] Error:", error);
      return null;
    }
  }

  async clearAuth(): Promise<void> {
    await clearSecureToken();
    await AsyncStorage.removeItem(AuthService.USER_KEY);
  }

  async hasCompletedVehicleSetup(): Promise<boolean> {
    try {
      const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      if (!userData) return false;

      const user = JSON.parse(userData);
      // Check both vehicles array and legacy vehicle field
      const hasVehicles = user.vehicles && user.vehicles.length > 0;
      const hasLegacyVehicle =
        user.vehicle &&
        (user.vehicle.licensePlate || user.vehicle.plate_number);
      return hasVehicles || hasLegacyVehicle;
    } catch (error) {
      return false;
    }
  }

  async saveVehicleInfo(vehicleData: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    batteryType: string;
  }): Promise<User> {
    const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
    if (!userData) {
      throw new Error("User not found");
    }

    const user = JSON.parse(userData);
    user.vehicle = vehicleData;

    await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    return user;
  }

  /**
   * Verify 2FA with PIN or biometric
   * POST /api/v1/auth/verify-2fa
   */
  async verify2FA(payload: {
    type: "pin" | "biometric";
    pin?: string;
  }): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/verify-2fa`, {
          type: payload.type,
          pin: payload.pin ? "***" : undefined,
        });
      }

      const res = await api.post(`${this.baseUrl}/verify-2fa`, payload);

      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ⇠ POST",
          `${this.baseUrl}/verify-2fa`,
          "→",
          res.status
        );
      }

      const body: any = res.data;
      const root: any = body?.data?.data ?? body?.data ?? body;

      return {
        success: root.success || true,
        data: { verified: root.verified || true },
      };
    } catch (error: any) {
      const status = error?.response?.status;
      const respData = error?.response?.data;
      const message =
        respData?.message || respData?.error || "2FA verification failed";

      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] 2FA verification failed", {
          status,
          respData,
          errorMessage: error?.message,
        });
      }

      let code = "2FA_VERIFY_FAILED";
      if (status === 401) code = "2FA_VERIFY_INVALID";

      return {
        success: false,
        error: { code, message },
      };
    }
  }

  async getMe(): Promise<User | null> {
    try {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ GET", `${this.baseUrl}/profile`);
      }
      const res = await api.get(`${this.baseUrl}/profile`);
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇠ GET", `${this.baseUrl}/profile`, "→", res.status);
      }
      const data = res.data?.data || res.data;

      // Get existing user data to preserve vehicle info
      const existingUserData = await AsyncStorage.getItem(AuthService.USER_KEY);
      const existingUser = existingUserData
        ? JSON.parse(existingUserData)
        : null;

      // Map API user -> local User shape
      const splitName = (data.name || "").trim().split(/\s+/);
      const user: User = {
        id: data.id,
        firstName: splitName.slice(0, -1).join(" ") || splitName[0] || "",
        lastName: splitName.slice(-1).join(" ") || "",
        email: data.email,
        phone: data.phone || "",
        createdAt: data.createdAt || new Date().toISOString(),
        membershipLevel: data.membershipLevel || "bronze",
        emailVerified: data.is_verified || false,
        role: data.role || "user",
      } as User;

      // Preserve vehicle from existing user if API doesn't return it
      if (existingUser && (existingUser as any).vehicle && !data.vehicle) {
        (user as any).vehicle = (existingUser as any).vehicle;
      } else if (data.vehicle) {
        (user as any).vehicle = data.vehicle;
      }

      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      // If unauthorized, clear token
      const status = err?.response?.status;
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ✖ GET",
          `${this.baseUrl}/profile`,
          status || "NETWORK"
        );
      }
      if (status === 401) {
        await this.clearAuth();
      }
      return null;
    }
  }

  /**
   * Verify email with verification token
   * POST /auth/verify-email { email, token }
   */
  async verifyEmail(
    email: string,
    token: string
  ): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/verify-email`, {
          email,
          token: "***",
        });
      }
      await api.post(`${this.baseUrl}/verify-email`, { email, token });
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇠ POST", `${this.baseUrl}/verify-email`, "→ ok");
      }
      // Optionally we could mark user as verified in local store if user object exists
      const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // only add flag locally (not in type definition) if needed
          user.emailVerified = true; // soft property; ignored elsewhere
          await AsyncStorage.setItem(
            AuthService.USER_KEY,
            JSON.stringify(user)
          );
        } catch {}
      }
      return { success: true, data: { verified: true } };
    } catch (error: any) {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ✖ POST",
          `${this.baseUrl}/verify-email`,
          error?.response?.status || "NETWORK"
        );
      }
      return {
        success: false,
        error: {
          code:
            error?.response?.status === 401
              ? "INVALID_TOKEN"
              : "VERIFY_EMAIL_FAILED",
          message:
            error?.response?.data?.message || "Email verification failed",
        },
      };
    }
  }

  /**
   * Resend email verification OTP/token
   * POST /auth/resend-otp { email }
   */
  async resendEmailOtp(): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      // Backend derives email from access token; no body needed
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/resend-otp`);
      }
      await api.post(`${this.baseUrl}/resend-otp`);
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇠ POST", `${this.baseUrl}/resend-otp`, "→ ok");
      }
      return { success: true, data: { sent: true } };
    } catch (error: any) {
      const status = error?.response?.status;
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ✖ POST",
          `${this.baseUrl}/resend-otp`,
          status || "NETWORK"
        );
      }
      return {
        success: false,
        error: {
          code: status === 409 ? "ALREADY_VERIFIED" : "RESEND_OTP_FAILED",
          message:
            error?.response?.data?.message ||
            "Failed to resend verification token",
        },
      };
    }
  }

  /**
   * Setup 2FA with 6-digit PIN
   * POST /auth/setup-2fa { pin: "123456" }
   */
  async setup2FA(pin: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log("[auth] ⇢ POST", `${this.baseUrl}/setup-2fa`, {
          pin: "***",
        });
      }
      const res = await api.post(`${this.baseUrl}/setup-2fa`, { pin });
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ⇠ POST",
          `${this.baseUrl}/setup-2fa`,
          "→",
          res.status
        );
      }
      // Mark user as 2FA enabled locally
      const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          (user as any).is_2fa_enabled = true;
          await AsyncStorage.setItem(
            AuthService.USER_KEY,
            JSON.stringify(user)
          );
        } catch {}
      }
      return { success: true, data: { success: true } };
    } catch (error: any) {
      const status = error?.response?.status;
      if (AuthService.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(
          "[auth] ✖ POST",
          `${this.baseUrl}/setup-2fa`,
          status || "NETWORK"
        );
      }
      return {
        success: false,
        error: {
          code: status === 409 ? "ALREADY_ENABLED" : "SETUP_2FA_FAILED",
          message: error?.response?.data?.message || "Failed to setup 2FA",
        },
      };
    }
  }
}

export default new AuthService();
