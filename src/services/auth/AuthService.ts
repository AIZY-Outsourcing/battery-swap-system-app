import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, LoginForm, RegisterForm, User } from "../../types";

const API_BASE_URL = "https://api.bss-app.com"; // Replace with actual API URL

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/auth`;
  }

  async login(
    credentials: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // TODO: Implement actual API call
      // const response = await fetch(`${this.baseUrl}/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // return await response.json();

      // Mock response for now
      return {
        success: true,
        data: {
          user: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: credentials.email,
            phone: "+1234567890",
            createdAt: "2024-01-01T00:00:00Z",
            membershipLevel: "gold",
          },
          token: "mock-jwt-token",
        },
      };
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
      // TODO: Implement actual API call
      return {
        success: true,
        data: {
          user: {
            id: "1",
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            createdAt: new Date().toISOString(),
            membershipLevel: "bronze",
          },
          token: "mock-jwt-token",
        },
      };
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
      // TODO: Implement actual API call
      return {
        success: true,
        data: { otpSent: true },
      };
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
      // TODO: Implement actual API call
      if (otp === "123456") {
        return {
          success: true,
          data: {
            user: {
              id: "1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@email.com",
              phone,
              createdAt: "2024-01-01T00:00:00Z",
              membershipLevel: "gold",
            },
            token: "mock-jwt-token",
          },
        };
      } else {
        throw new Error("Invalid OTP");
      }
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
      // TODO: Implement actual API call
      return {
        success: true,
        data: {},
      };
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
      // TODO: Implement actual API call
      return {
        success: true,
        data: { token: "new-mock-jwt-token" },
      };
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

    // Save to AsyncStorage
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, mockToken);
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

    // Save to AsyncStorage
    await AsyncStorage.setItem(AuthService.TOKEN_KEY, mockToken);
    await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(mockUser));

    return { token: mockToken, user: mockUser };
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AuthService.TOKEN_KEY);
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
    await AsyncStorage.removeItem(AuthService.TOKEN_KEY);
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
}

export default new AuthService();
