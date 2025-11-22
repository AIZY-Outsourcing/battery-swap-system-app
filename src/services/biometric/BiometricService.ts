import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const BIOMETRIC_CREDENTIALS_KEY = "biometric_credentials";

export interface BiometricCredentials {
  phone: string;
  password: string;
  enabled: boolean;
}

class BiometricService {
  /**
   * Check if device supports biometric authentication
   */
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("[BiometricService] Error checking availability:", error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error("[BiometricService] Error getting supported types:", error);
      return [];
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticate(promptMessage?: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || "Xác thực để đăng nhập",
        fallbackLabel: "Sử dụng mật khẩu",
        cancelLabel: "Hủy",
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error("[BiometricService] Authentication error:", error);
      return false;
    }
  }

  /**
   * Save credentials for biometric login
   */
  async saveCredentials(phone: string, password: string): Promise<void> {
    try {
      const credentials: BiometricCredentials = {
        phone,
        password,
        enabled: true,
      };

      await SecureStore.setItemAsync(
        BIOMETRIC_CREDENTIALS_KEY,
        JSON.stringify(credentials)
      );

      console.log("[BiometricService] Credentials saved successfully");
    } catch (error) {
      console.error("[BiometricService] Error saving credentials:", error);
      throw error;
    }
  }

  /**
   * Get saved credentials
   */
  async getCredentials(): Promise<BiometricCredentials | null> {
    try {
      const data = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as BiometricCredentials;
    } catch (error) {
      console.error("[BiometricService] Error getting credentials:", error);
      return null;
    }
  }

  /**
   * Get saved email/phone only (without password)
   */
  async getSavedEmail(): Promise<string | null> {
    try {
      const credentials = await this.getCredentials();
      return credentials?.phone || null;
    } catch (error) {
      console.error("[BiometricService] Error getting saved email:", error);
      return null;
    }
  }

  /**
   * Check if biometric login is enabled
   */
  async isEnabled(): Promise<boolean> {
    try {
      const credentials = await this.getCredentials();
      return credentials?.enabled === true;
    } catch (error) {
      console.error("[BiometricService] Error checking if enabled:", error);
      return false;
    }
  }

  /**
   * Enable biometric login
   */
  async enable(phone: string, password: string): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        throw new Error("Thiết bị không hỗ trợ xác thực sinh trắc học");
      }

      await this.saveCredentials(phone, password);
      return true;
    } catch (error) {
      console.error("[BiometricService] Error enabling biometric:", error);
      throw error;
    }
  }

  /**
   * Disable biometric login
   */
  async disable(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
      console.log("[BiometricService] Biometric login disabled");
    } catch (error) {
      console.error("[BiometricService] Error disabling biometric:", error);
      throw error;
    }
  }

  /**
   * Clear all saved credentials
   */
  async clear(): Promise<void> {
    try {
      await this.disable();
    } catch (error) {
      console.error("[BiometricService] Error clearing credentials:", error);
    }
  }

  /**
   * Get biometric type name for display
   */
  async getBiometricTypeName(): Promise<string> {
    try {
      const types = await this.getSupportedTypes();

      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        return "Face ID";
      }

      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return "Touch ID";
      }

      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return "Iris";
      }

      return "Sinh trắc học";
    } catch (error) {
      console.error(
        "[BiometricService] Error getting biometric type name:",
        error
      );
      return "Sinh trắc học";
    }
  }
}

export default new BiometricService();
