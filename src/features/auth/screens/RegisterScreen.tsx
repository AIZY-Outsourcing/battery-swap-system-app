import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { useAuthStore } from "../../../store/authStore";
import { track } from "../../../services/analytics";
import { RegisterForm } from "@/src/types";
import { Input, ThemedButton } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";

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
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Tham gia BSS ngay hôm nay!</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>Họ</Text>
              <View style={styles.inputWrapper}>
                <Input
                  placeholder="Nguyễn"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  containerStyle={styles.inputContainerStyle}
                />
              </View>
            </View>
            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>Tên</Text>
              <View style={styles.inputWrapper}>
                <Input
                  placeholder="An"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  containerStyle={styles.inputContainerStyle}
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  email.length > 0 && !emailValid ? "Email không hợp lệ" : undefined
                }
                style={styles.input}
                containerStyle={styles.inputContainerStyle}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="0912345678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={
                  phone.length > 0 && !phoneValid ? "SĐT không hợp lệ" : undefined
                }
                style={styles.input}
                containerStyle={styles.inputContainerStyle}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={
                  password.length > 0 && !passwordValid ? "Ít nhất 6 ký tự" : undefined
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

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                error={
                  confirmPassword.length > 0 && !confirmValid
                    ? "Không khớp"
                    : undefined
                }
                style={styles.input}
                containerStyle={styles.inputContainerStyle}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#5D7B6F" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (!formValid || isLoading) && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={!formValid || isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              Đã có tài khoản? <Text style={styles.loginButtonTextBold}>Đăng nhập</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
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
    gap: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameInputContainer: {
    flex: 1,
    gap: 8,
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
  registerButton: {
    backgroundColor: "#5D7B6F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: "#B0D4B8",
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    gap: 16,
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  loginButton: {
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#64748b",
  },
  loginButtonTextBold: {
    color: "#5D7B6F",
    fontWeight: "600",
  },
  versionText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
