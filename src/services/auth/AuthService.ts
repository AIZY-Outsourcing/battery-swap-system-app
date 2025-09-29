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

  async login(
    credentials: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Backend expects emailOrPhone field
      const payload = {
        emailOrPhone: credentials.email, // LoginForm.email can be email or phone
        password: credentials.password,
      };
      const res = await api.post(`${this.baseUrl}/login`, payload);
      const data: any = res.data.data.data;

      const apiUser: any = data.user || {};

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

      const access = data.tokens?.access_token;
      const refresh = data.tokens?.refresh_token;
      if (access) await setSecureToken(access);
      if (refresh) await setRefreshToken(refresh);

      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      return { success: true, data: { token: access, user } };
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Invalid credentials";
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
      const res = await api.post(`${this.baseUrl}/signup`, payload);
      const data: any = res.data?.data || res.data;
      const apiUser: any = data.user || data.profile || data.account || {};
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
      const access =
        data.tokens?.access_token || data.access_token || data.token;
      const refresh = data.tokens?.refresh_token || data.refresh_token;
      if (access) await setSecureToken(access);
      if (refresh) await setRefreshToken(refresh);
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
      if (__DEV__) {
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
        await api.post(`${this.baseUrl}/logout`);
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
      const res = await api.post(`${this.baseUrl}/refresh`, {
        refresh_token: token,
      });
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
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
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
      return !!(user.vehicle && user.vehicle.licensePlate);
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

  async getMe(): Promise<User | null> {
    try {
      const res = await api.get(`${this.baseUrl}/profile`);
      const data = res.data?.data || res.data;

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

      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      // If unauthorized, clear token
      const status = err?.response?.status;
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
      await api.post(`${this.baseUrl}/verify-email`, { email, token });
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
      await api.post(`${this.baseUrl}/resend-otp`);
      return { success: true, data: { sent: true } };
    } catch (error: any) {
      const status = error?.response?.status;
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
}

export default new AuthService();
