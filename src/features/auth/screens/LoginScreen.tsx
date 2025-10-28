import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../theme/ThemeProvider";
import { Input, ThemedButton } from "../../../components";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { useAuthStore } from "../../../store/authStore";
import { track } from "../../../services/analytics";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simple validators
  const emailValid = useMemo(
    () => /.+@.+\..+/.test(email) || /^\+?\d{9,15}$/.test(email),
    [email]
  );
  const passwordValid = useMemo(() => password.length >= 6, [password]);
  const formValid = emailValid && passwordValid;

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Accept mock demo credentials
    if (
      (email === "demo@bss.com" || email === "+84999999999") &&
      password === "demo123"
    ) {
      track({ name: "login_success" });
      // Navigate directly without alert
      navigation.navigate("VehicleSetup", { userId: "demo" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.login({ email, password });
      if (!res.success) {
        Alert.alert("Lỗi", res.error?.message || "Đăng nhập thất bại");
        return;
      }
      const token = res.data?.token; // AuthService returns token (access_token)
      const user = res.data?.user;

      if (!token || !user) {
        Alert.alert("Lỗi", "Lỗi đăng nhập - vui lòng thử lại");
        return;
      }

      console.log("✅ [LoginScreen] Login successful, updating authStore...", {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.id,
      });

      setAuth(token, user);
      track({ name: "login_success" });

      // Check flags from backend response
      const needsPinSetup = (res.data as any)?.needsPinSetup ?? false;
      const needsVehicleSetup = (res.data as any)?.needsVehicleSetup ?? false;

      // Check if email is verified from API response
      if (!user.emailVerified) {
        navigation.replace("EmailVerification" as any);
        return;
      }

      // Check if PIN setup is needed
      if (needsPinSetup) {
        navigation.replace("PinSetup");
        return;
      }

      // Check if vehicle setup is needed
      if (needsVehicleSetup) {
        navigation.replace("VehicleSetup");
        return;
      }

      // User is verified, has PIN, and has vehicle - go to main app
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "AppStack" as any }],
      });
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#5D7B6F" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
            name="battery-charging-medium" 
            size={40} 
            color="#5D7B6F" 
          />
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email / Số điện thoại</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Nhập email hoặc số điện thoại"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  email.length > 0 && !emailValid
                    ? "Email / SĐT không hợp lệ"
                    : undefined
                }
                style={styles.input}
                containerStyle={styles.inputContainerStyle}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={
                  password.length > 0 && !passwordValid
                    ? "Ít nhất 6 ký tự"
                    : undefined
                }
                style={styles.input}
                containerStyle={styles.inputContainerStyle}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#5D7B6F" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!formValid || isLoading) && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={!formValid || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          {/* Quick Options */}
          <View style={styles.quickOptionsContainer}>
            <Text style={styles.quickOptionsTitle}>Đăng nhập nhanh</Text>
            <View style={styles.quickOptionsRow}>
              <TouchableOpacity 
                style={styles.quickOptionButton}
                onPress={() => {/* Biometric login coming soon */}}
              >
                <Ionicons name="finger-print" size={24} color="#5D7B6F" />
                <Text style={styles.quickOptionText}>Vân tay</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickOptionButton}
                onPress={() => {/* Face ID login coming soon */}}
              >
                <Ionicons name="scan" size={24} color="#5D7B6F" />
                <Text style={styles.quickOptionText}>Face ID</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>
            Chưa có tài khoản? <Text style={styles.registerButtonTextBold}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>BSS v1.0.0</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D7F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#B0D4B8",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    paddingRight: 50,
  },
  inputContainerStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  eyeIcon: {
    position: "absolute",
    right: 26,
    top: "50%",
    transform: [{ translateY: -1 }],
    padding: 4,
    zIndex: 1,
  },
  loginButton: {
    backgroundColor: "#5D7B6F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#B0D4B8",
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickOptionsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  quickOptionsTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    fontWeight: "500",
  },
  quickOptionsRow: {
    flexDirection: "row",
    gap: 20,
  },
  quickOptionButton: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#EAE7D6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B0D4B8",
    minWidth: 80,
  },
  quickOptionText: {
    fontSize: 12,
    color: "#5D7B6F",
    marginTop: 8,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
    gap: 16,
  },
  registerButton: {
    paddingVertical: 8,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#64748b",
  },
  registerButtonTextBold: {
    color: "#5D7B6F",
    fontWeight: "600",
  },
  versionText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
