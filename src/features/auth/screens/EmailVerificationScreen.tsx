import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { Input, ThemedButton, ThemedCard } from "../../../components";
import AuthLayout from "../components/AuthLayout";
import { useTheme } from "../../../theme/ThemeProvider";
import { useAuthStore } from "../../../store/authStore";

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

export default function EmailVerificationScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user, setUser } = useAuthStore();
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(30);

  // helper to mask email for display (keeps first 2 and domain visible)
  const maskEmail = (e?: string) => {
    if (!e) return "";
    const [local, domain] = e.split("@");
    if (!domain) return e;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
  };

  useEffect(() => {
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
    if (resending || submitting) return;
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
      const user = await AuthService.getCurrentUser();
      if (!user?.email) {
        Alert.alert("Lỗi", "Không tìm thấy email người dùng");
        return;
      }
      const res = await AuthService.verifyEmail(user.email, token);
      if (res.success) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        Alert.alert("Thành công", "Email đã được xác minh", [
          { text: "Tiếp tục", onPress: () => navigation.replace("PinSetup") },
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
      subtitle={`Nhập mã đã gửi tới ${email ? maskEmail(email) : "email"}`}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerWrap}>
            <ThemedCard
              style={StyleSheet.flatten([
                styles.card,
                {
                  backgroundColor:
                    theme?.colors?.primaryLight ||
                    theme?.colors?.tertiary ||
                    undefined,
                },
              ])}
            >
              <View style={styles.innerContainer}>
                <Text
                  style={[
                    styles.infoText,
                    { color: theme?.colors?.primary || "#666" },
                  ]}
                >
                  Mã gồm 6 ký tự. Kiểm tra thư mục spam nếu không thấy email.
                </Text>
                <Input
                  placeholder="Mã xác minh"
                  value={token}
                  onChangeText={(val) => setToken(val.trim())}
                  autoCapitalize="characters"
                  maxLength={6}
                  autoFocus
                />
                <ThemedButton
                  title={submitting ? "Đang xác minh..." : "Xác minh"}
                  onPress={handleVerify}
                  disabled={submitting}
                  fullWidth
                />

                <View style={styles.rowBetween}>
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
                </View>

                <ThemedButton
                  title="Quay về đăng nhập"
                  onPress={() => navigation.replace("Login")}
                  variant="tertiary"
                  fullWidth
                />
              </View>
              <View style={styles.footerRow}>
                <Text
                  style={[
                    styles.smallText,
                    { color: theme?.colors?.primaryLight || "#999" },
                  ]}
                >
                  Đã gửi tới: {email ? maskEmail(email) : "-"}
                </Text>
              </View>
            </ThemedCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minWidth: 320,
    maxWidth: 520,
    width: "92%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  innerContainer: {
    gap: 16,
    alignItems: "stretch",
  },
  centerWrap: {
    alignItems: "center",
    width: "100%",
  },
  rowBetween: {
    width: "100%",
  },
  footerRow: {
    marginTop: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    marginBottom: 8,
  },
  smallText: {
    fontSize: 12,
  },
});
