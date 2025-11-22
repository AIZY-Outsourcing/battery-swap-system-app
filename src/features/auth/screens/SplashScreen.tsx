import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { track } from "../../../services/analytics";
import { useAuthStore } from "../../../store/authStore";

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showDebugButtons, setShowDebugButtons] = useState(false);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      track({ name: "app_launch" });

      console.log("🚀 [SplashScreen] Starting auth check...");

      // Hydrate auth store from AsyncStorage/SecureStore first
      await hydrate();

      console.log(
        "⏳ [SplashScreen] Hydration complete, checking auth status..."
      );

      // Brief delay to show splash
      await new Promise((resolve) => setTimeout(resolve, 500));

      const isLoggedIn = await AuthService.isLoggedIn();
      console.log("🔐 [SplashScreen] isLoggedIn:", isLoggedIn);

      track({
        name: "auth_state_checked",
        result: isLoggedIn ? "logged_in" : "logged_out",
      });

      if (isLoggedIn) {
        console.log("✅ [SplashScreen] User is logged in, fetching profile...");
        // Try refresh / fetch profile
        await AuthService.getMe();

        // Check if user has vehicle in local storage
        const user = await AuthService.getCurrentUser();
        const hasVehicle = !!(user && (user as any).vehicle);

        console.log(
          "🚗 [SplashScreen] hasVehicle:",
          hasVehicle,
          "vehicle:",
          (user as any)?.vehicle?.id
        );

        if (hasVehicle) {
          // User has vehicle, go to main app
          console.log("➡️ [SplashScreen] Navigating to AppStack");
          navigation.replace("AppStack");
        } else {
          // User needs to complete vehicle setup
          console.log(
            "➡️ [SplashScreen] Navigating to AuthStack (vehicle setup needed)"
          );
          navigation.replace("AuthStack");
        }
      } else {
        // User not logged in, show auth options
        console.log("❌ [SplashScreen] Not logged in, showing auth options");
        setIsCheckingAuth(false);
        setShowDebugButtons(true);
      }
    } catch (error) {
      console.error("⚠️ [SplashScreen] Auth check error:", error);
      setIsCheckingAuth(false);
      setShowDebugButtons(true);
    }
  };

  const goToAuth = () => {
    navigation.replace("AuthStack");
  };

  const goToMainApp = () => {
    navigation.replace("AppStack");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="BSS Logo"
      />
      <Text style={styles.appName}>BSS Battery Swap</Text>
      <Text style={styles.tagline}>
        Đổi pin thông minh - Di chuyển không giới hạn
      </Text>

      {isCheckingAuth ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>
            Đang kiểm tra trạng thái đăng nhập...
          </Text>
        </View>
      ) : showDebugButtons ? (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Chọn hành động:</Text>
          <TouchableOpacity style={styles.debugButton} onPress={goToAuth}>
            <Text style={styles.debugButtonText}>🔐 Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.debugButton, styles.debugButtonSecondary]}
            onPress={goToMainApp}
          >
            <Text
              style={[styles.debugButtonText, styles.debugButtonSecondaryText]}
            >
              🚀 Demo Mode (Bỏ qua đăng nhập)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.debugButton]}
            onPress={() => {
              setIsCheckingAuth(true);
              setShowDebugButtons(false);
              checkAuthStatus();
            }}
          >
            <Text style={styles.debugButtonText}>🔁 Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D7B6F",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  debugContainer: {
    marginTop: 40,
    width: "80%",
    alignItems: "center",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  debugButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  debugButtonMain: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  debugButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  debugButtonMainText: {
    color: "#ffffff",
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
  debugButtonSecondary: {
    backgroundColor: "#f8f9fa",
    borderColor: "#dee2e6",
  },
  debugButtonSecondaryText: {
    color: "#6c757d",
  },
});

export default SplashScreen;
