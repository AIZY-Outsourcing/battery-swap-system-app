import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../theme/ThemeProvider";
import { Input, ThemedButton, ThemedCard } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await AuthService.simpleLogin(email, password);

      Alert.alert("Thành công", `Chào mừng ${user.firstName}!`, [
        {
          text: "Tiếp tục",
          onPress: () => {
            // Navigate to vehicle setup
            navigation.navigate("VehicleSetup", { userId: user.id });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    // For testing purposes - navigate directly to main app
    navigation.navigate("VehicleSetup", { userId: "test-user-123" });
  };

  const handlePhoneLogin = () => {
    navigation.navigate("OTPVerification", {
      phone: "+1234567890",
      email: email || "test@example.com",
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.primaryLight,
          theme.colors.secondary,
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>⚡</Text>
          </View>
          <Text style={styles.title}>Welcome to BSS</Text>
          <Text style={styles.subtitle}>Battery Swapping Station</Text>
        </View>

        {/* Login Form Card */}
        <ThemedCard style={styles.formCard}>
          <Text
            style={[styles.formTitle, { color: theme.colors.text.primary }]}
          >
            Sign In
          </Text>

          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: theme.spacing[4] }}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginBottom: theme.spacing[6] }}
            />

            <ThemedButton
              title={isLoading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              fullWidth
              style={{ marginBottom: theme.spacing[4] }}
              disabled={isLoading}
            />

            {/* Quick Test Login Button */}
            <ThemedButton
              title="🚀 Quick Login for Testing"
              onPress={handleQuickLogin}
              variant="secondary"
              fullWidth
              style={{
                marginBottom: theme.spacing[4],
                backgroundColor: "#ff6b35",
              }}
            />

            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border.default },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                OR
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border.default },
                ]}
              />
            </View>

            <ThemedButton
              title="📱 Continue with Phone"
              onPress={handlePhoneLogin}
              variant="secondary"
              fullWidth
              style={{ marginBottom: theme.spacing[6] }}
            />

            {/* Quick Login Options */}
            <View style={styles.quickLogin}>
              <Text
                style={[
                  styles.quickLoginText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Quick Login
              </Text>
              <View style={styles.quickLoginButtons}>
                <ThemedButton
                  title="👆 Fingerprint"
                  variant="tertiary"
                  size="sm"
                  style={{ flex: 1, marginRight: theme.spacing[2] }}
                  onPress={() =>
                    Alert.alert("Info", "Biometric login coming soon!")
                  }
                />
                <ThemedButton
                  title="😀 Face ID"
                  variant="tertiary"
                  size="sm"
                  style={{ flex: 1 }}
                  onPress={() =>
                    Alert.alert("Info", "Face ID login coming soon!")
                  }
                />
              </View>
            </View>
          </View>
        </ThemedCard>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedButton
            title="Don't have an account? Sign Up"
            onPress={() => navigation.navigate("Register")}
            variant="tertiary"
            style={{ marginBottom: theme.spacing[2] }}
          />

          <Text
            style={[styles.versionText, { color: theme.colors.text.tertiary }]}
          >
            BSS v1.0.0
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  formCard: {
    marginBottom: 30,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  quickLogin: {
    alignItems: "center",
  },
  quickLoginText: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "500",
  },
  quickLoginButtons: {
    flexDirection: "row",
    width: "100%",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
  },
});
