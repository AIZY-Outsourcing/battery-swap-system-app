import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { useAuthStore } from "../../../store/authStore";
import { track } from "../../../services/analytics";
import { RegisterForm } from "@/src/types";
import { Input, ThemedButton, ThemedCard } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";
import AuthLayout from "../components/AuthLayout";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Basic validation
  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const phoneValid = useMemo(() => /^\+?\d{9,15}$/.test(phone), [phone]);
  const passwordValid = useMemo(() => password.length >= 6, [password]);
  const confirmValid = useMemo(
    () => confirmPassword.length > 0 && confirmPassword === password,
    [confirmPassword, password]
  );
  const formValid =
    firstName &&
    lastName &&
    emailValid &&
    phoneValid &&
    passwordValid &&
    confirmValid;

  const fillTestData = () => {
    setFirstName("Nguyen");
    setLastName("Van A");
    setEmail("test@bss.com");
    setPhone("0912345678");
    setPassword("123456");
    setConfirmPassword("123456");
  };

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRegister = async () => {
    if (!formValid) {
      Alert.alert("Lỗi", "Thông tin chưa hợp lệ");
      return;
    }

    setIsLoading(true);
    track({ name: "signup_initiated" });

    try {
      const res = await AuthService.register({
        firstName,
        lastName,
        email,
        phone,
        password,
      } as RegisterForm);

      if (!res.success) {
        Alert.alert("Lỗi", res.error?.message || "Đăng ký thất bại");
        return;
      }
      const token = res.data?.token || null;
      const user = res.data?.user as any;
      if (token && user) setAuth(token, user);

      // After signup, email verification is always needed
      Alert.alert(
        "Thành công",
        `Đã tạo tài khoản. Email xác minh đã tự động gửi tới ${email}.`,
        [
          {
            text: "Tiếp tục",
            onPress: () => navigation.replace("EmailVerification" as any),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Tham gia BSS ngay hôm nay">
      <ThemedCard>
        <View style={styles.formStack}>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Họ"
                placeholder="Nguyễn"
                value={firstName}
                onChangeText={setFirstName}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={theme.colors.text.secondary}
                  />
                }
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Tên"
                placeholder="An"
                value={lastName}
                onChangeText={setLastName}
                leftIcon={
                  <Ionicons
                    name="person-circle-outline"
                    size={18}
                    color={theme.colors.text.secondary}
                  />
                }
              />
            </View>
          </View>
          <Input
            label="Email"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={
              email.length > 0 && !emailValid ? "Email không hợp lệ" : undefined
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
            label="Số điện thoại"
            placeholder="0912345678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={
              phone.length > 0 && !phoneValid ? "SĐT không hợp lệ" : undefined
            }
            leftIcon={
              <Ionicons
                name="call-outline"
                size={18}
                color={
                  phone.length > 0 && !phoneValid
                    ? theme.colors.error
                    : theme.colors.text.secondary
                }
              />
            }
          />
          <Input
            label="Mật khẩu"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            error={
              password.length > 0 && !passwordValid ? ">= 6 ký tự" : undefined
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
          <Input
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            error={
              confirmPassword.length > 0 && !confirmValid
                ? "Không khớp"
                : undefined
            }
            leftIcon={
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={
                  confirmPassword.length > 0 && !confirmValid
                    ? theme.colors.error
                    : theme.colors.text.secondary
                }
              />
            }
            rightIcon={
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.text.secondary}
              />
            }
            onRightIconPress={() => setShowConfirmPassword((s) => !s)}
          />
          <ThemedButton
            title={isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
            onPress={handleRegister}
            fullWidth
            disabled={isLoading || !formValid}
          />
          {__DEV__ && (
            <ThemedButton
              title="🧪 Điền dữ liệu test"
              onPress={fillTestData}
              variant="secondary"
              fullWidth
            />
          )}
          {__DEV__ && (
            <ThemedButton
              title="➡️ Dev: Tới xác minh email"
              onPress={() => navigation.navigate("EmailVerification" as any)}
              variant="tertiary"
              fullWidth
            />
          )}
          <ThemedButton
            title="Đã có tài khoản? Đăng nhập"
            onPress={() => navigation.navigate("Login")}
            variant="tertiary"
            fullWidth
          />
        </View>
      </ThemedCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formStack: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  icon: {
    fontSize: 14,
  },
});
