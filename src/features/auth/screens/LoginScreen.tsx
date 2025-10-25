import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../theme/ThemeProvider";
import { Input, ThemedButton, ThemedCard } from "../../../components";
// Layout
import AuthLayout from "../components/AuthLayout";
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
      return Alert.alert("Thành công", "Đăng nhập demo", [
        {
          text: "Tiếp tục",
          onPress: () =>
            navigation.navigate("VehicleSetup", { userId: "demo" }),
        },
      ]);
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

      setAuth(token, user);
      track({ name: "login_success" });

      // Check flags from backend response
      const needsPinSetup = (res.data as any)?.needsPinSetup ?? false;
      const needsVehicleSetup = (res.data as any)?.needsVehicleSetup ?? false;

      // Check if email is verified from API response
      if (!user.emailVerified) {
        Alert.alert("Yêu cầu xác minh", "Vui lòng xác minh email trước.", [
          {
            text: "Xác minh",
            onPress: () => navigation.replace("EmailVerification" as any),
          },
        ]);
        return;
      }

      // Check if PIN setup is needed
      if (needsPinSetup) {
        Alert.alert("Tạo mã PIN", "Vui lòng tạo mã PIN 6 số để bảo mật.", [
          {
            text: "Tạo PIN",
            onPress: () => navigation.replace("PinSetup"),
          },
        ]);
        return;
      }

      // Check if vehicle setup is needed
      if (needsVehicleSetup) {
        Alert.alert(
          "Thành công",
          `Chào mừng ${user.firstName}! Hãy thiết lập phương tiện.`,
          [
            {
              text: "Thiết lập xe",
              onPress: () => navigation.replace("VehicleSetup"),
            },
          ]
        );
        return;
      }

      // User is verified, has PIN, and has vehicle - go to main app
      Alert.alert("Thành công", `Chào mừng trở lại ${user.firstName}!`, [
        {
          text: "Vào ứng dụng",
          onPress: () =>
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: "AppStack" as any }],
            }),
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

  return (
    <AuthLayout
      title="BSS"
      subtitle="Battery Swapping Station"
      contentContainerStyle={{}}
    >
      <ThemedCard style={{ paddingVertical: theme.spacing[6] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.semibold as any,
            textAlign: "center",
            marginBottom: theme.spacing[6],
            color: theme.colors.text.primary,
          }}
        >
          Đăng nhập
        </Text>

        <View style={{ gap: theme.spacing[5] }}>
          <View style={styles.fieldGroup}>
            <Input
              label="Email / Số điện thoại"
              placeholder="Nhập email hoặc số điện thoại"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={
                email.length > 0 && !emailValid
                  ? "Email / SĐT không hợp lệ"
                  : undefined
              }
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={
                    email.length > 0 && !emailValid
                      ? theme.colors.error
                      : theme.colors.text.secondary
                  }
                />
              }
            />
            <Input
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={
                password.length > 0 && !passwordValid
                  ? "Ít nhất 6 ký tự"
                  : undefined
              }
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
              onRightIconPress={() => setShowPassword((s) => !s)}
            />
          </View>
          <ThemedButton
            title={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            onPress={handleLogin}
            variant="primary"
            fullWidth
            disabled={isLoading || !formValid}
          />
          {__DEV__ && (
            <ThemedButton
              title="🚀 Quick Login (Dev)"
              onPress={handleQuickLogin}
              variant="secondary"
              fullWidth
            />
          )}
          <View style={{ gap: theme.spacing[3] }}>
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium as any,
              }}
            >
              Tuỳ chọn nhanh (sắp ra mắt)
            </Text>
            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <ThemedButton
                title="👆 Vân tay"
                variant="tertiary"
                size="sm"
                style={{ flex: 1 }}
                onPress={() =>
                  Alert.alert("Thông tin", "Biometric login coming soon!")
                }
              />
              <ThemedButton
                title="😀 Face ID"
                variant="tertiary"
                size="sm"
                style={{ flex: 1 }}
                onPress={() =>
                  Alert.alert("Thông tin", "Face ID login coming soon!")
                }
              />
            </View>
          </View>
          <ThemedButton
            title="Chưa có tài khoản? Đăng ký"
            onPress={() => navigation.navigate("Register")}
            variant="tertiary"
            fullWidth
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              marginTop: theme.spacing[2],
            }}
          >
            BSS v1.0.0
          </Text>
        </View>
      </ThemedCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 12,
  },
  icon: {
    fontSize: 14,
  },
});
