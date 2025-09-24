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

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showDebugButtons, setShowDebugButtons] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isLoggedIn = await AuthService.isLoggedIn();

      if (isLoggedIn) {
        // Check if user has completed vehicle setup
        const hasVehicleSetup = await AuthService.hasCompletedVehicleSetup();

        if (hasVehicleSetup) {
          // User is fully set up, go to main app
          navigation.replace("AppStack");
        } else {
          // User needs to complete vehicle setup
          const user = await AuthService.getCurrentUser();
          navigation.replace("AuthStack");
          // Will navigate to VehicleSetup screen from auth stack
        }
      } else {
        // User not logged in, show auth options
        setIsCheckingAuth(false);
        setShowDebugButtons(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
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
      />
      <Text style={styles.appName}>BSS Battery Swap</Text>
      <Text style={styles.tagline}>
        Đổi pin thông minh - Di chuyển không giới hạn
      </Text>

      {isCheckingAuth ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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
    color: "#007AFF",
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
