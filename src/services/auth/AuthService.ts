import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, LoginForm, RegisterForm, User } from "../../types";
import { api, clearSecureToken, getSecureToken, setSecureToken } from "../api";

class AuthService {
  private baseUrl: string = "/auth";

  async login(
    credentials: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await api.post(`${this.baseUrl}/login`, credentials);
      const { token, user } = res.data as { token: string; user: User };
      await setSecureToken(token);
      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      return { success: true, data: { token, user } } as any;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "LOGIN_FAILED",
          message: "Invalid credentials",
        },
      };
    }
  }

  async register(
    userData: RegisterForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await api.post(`${this.baseUrl}/register`, userData);
      const { token, user } = res.data as { token: string; user: User };
      // Some backends only return success and email; handle both
      if (token && user) {
        await setSecureToken(token);
        await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      }
      return { success: true, data: { token, user } } as any;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message: "Registration failed",
        },
      };
    }
  }

  async sendOTP(phone: string): Promise<ApiResponse<{ otpSent: boolean }>> {
    try {
      const res = await api.post(`${this.baseUrl}/send-otp`, { phone });
      return { success: true, data: res.data };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "OTP_SEND_FAILED",
          message: "Failed to send OTP",
        },
      };
    }
  }

  async verifyOTP(
    phone: string,
    otp: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await api.post(`${this.baseUrl}/verify-otp`, { phone, otp });
      const { token, user } = res.data as { token?: string; user?: User };
      if (token) await setSecureToken(token);
      if (user)
        await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      return { success: true, data: { token, user } } as any;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "OTP_VERIFICATION_FAILED",
          message: "Invalid OTP",
        },
      };
    }
  }

  async logout(): Promise<ApiResponse<{}>> {
    try {
      await clearSecureToken();
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
      const res = await api.post(`${this.baseUrl}/refresh`, { token });
      const newToken = (res.data as any)?.token;
      if (newToken) await setSecureToken(newToken);
      return { success: true, data: { token: newToken } } as any;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TOKEN_REFRESH_FAILED",
          message: "Token refresh failed",
        },
      };
    }
  }

  // New methods for real auth flow
  private static TOKEN_KEY = "BSS_AUTH_TOKEN";
  private static USER_KEY = "BSS_USER_DATA";

  async simpleLogin(
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email.length < 3 || password.length < 3) {
      throw new Error("Email hoặc mật khẩu không hợp lệ");
    }

    // Mock successful login
    const mockUser: User = {
      id: "user_" + Date.now(),
      firstName: email.split("@")[0] || "User",
      lastName: "Doe",
      email: email,
      phone: "+84 901 234 567",
      createdAt: new Date().toISOString(),
      membershipLevel: "bronze",
    };

    const mockToken = "mock_token_" + Date.now();

    // Save token securely and user in storage
    await setSecureToken(mockToken);
    await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(mockUser));

    return { token: mockToken, user: mockUser };
  }

  async simpleRegister(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<{ token: string; user: User }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (userData.email.length < 3 || userData.password.length < 6) {
      throw new Error("Thông tin không hợp lệ");
    }

    const mockUser: User = {
      id: "user_" + Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      membershipLevel: "bronze",
    };

    const mockToken = "mock_token_" + Date.now();

    // Save token securely and user in storage
    await setSecureToken(mockToken);
    await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(mockUser));

    return { token: mockToken, user: mockUser };
  }

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
      const res = await api.get(`${this.baseUrl}/me`);
      const user = res.data as User;
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
}

export default new AuthService();
