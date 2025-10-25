import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { Input, ThemedButton, ThemedCard } from "../../../components";
import AuthLayout from "../components/AuthLayout";
import { useTheme } from "../../../theme/ThemeProvider";
import { useAuthStore } from "../../../store/authStore";

/**
 * EmailVerificationScreen
 * Flow: user arrives here after signup if backend requires email verification.
 * User enters token received by email, press verify -> calls AuthService.verifyEmail.
 * There is a resend button that invokes resendEmailOtp (no email param; backend derives).
 */

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

export default function EmailVerificationScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user, setUser } = useAuthStore();
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(30); // seconds between resends

  useEffect(() => {
    // Use email from store if available, otherwise fetch from storage
    if (user?.email) {
      setEmail(user.email);
    } else {
      (async () => {
        const user = await AuthService.getCurrentUser();
        setEmail(user?.email);
      })();
    }
  }, [user]);

  useEffect(() => {
    if (resending || submitting) return; // don't tick when busy
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown, resending, submitting]);

  const handleVerify = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Vui lòng nhập mã xác minh");
      return;
    }
    setSubmitting(true);
    try {
      // Need email from stored user
      const user = await AuthService.getCurrentUser();
      if (!user?.email) {
        Alert.alert("Lỗi", "Không tìm thấy email người dùng");
        return;
      }
      const res = await AuthService.verifyEmail(user.email, token);
      if (res.success) {
        // Update user in store to reflect email verification
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);

        Alert.alert("Thành công", "Email đã được xác minh", [
          {
            text: "Tiếp tục",
            onPress: () => navigation.replace("PinSetup"),
          },
        ]);
      } else {
        Alert.alert("Lỗi", res.error?.message || "Xác minh thất bại");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", e.message || "Không thể xác minh");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await AuthService.resendEmailOtp();
      if (res.success) {
        Alert.alert("Đã gửi", "Mã xác minh mới đã được gửi tới email");
      } else {
        Alert.alert("Lỗi", res.error?.message || "Không thể gửi lại mã");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể gửi lại mã");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Xác minh Email"
      subtitle={`Nhập mã đã gửi tới ${email || "email"}`}
    >
      <ThemedCard>
        <View style={{ gap: theme.spacing[4] }}>
          <Input
            placeholder="Mã xác minh"
            value={token}
            onChangeText={(val) => setToken(val.trim())}
            autoCapitalize="characters"
          />
          <ThemedButton
            title={submitting ? "Đang xác minh..." : "Xác minh"}
            onPress={handleVerify}
            disabled={submitting}
            fullWidth
          />
          <ThemedButton
            title={
              resending
                ? "Đang gửi..."
                : cooldown > 0
                ? `Gửi lại mã (${cooldown}s)`
                : "Gửi lại mã"
            }
            onPress={() => {
              if (cooldown > 0) return;
              handleResend();
              setCooldown(30);
            }}
            disabled={resending || cooldown > 0}
            variant="secondary"
            fullWidth
          />
          <ThemedButton
            title="Quay về đăng nhập"
            onPress={() => navigation.replace("Login")}
            variant="tertiary"
            fullWidth
          />
        </View>
      </ThemedCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({});
