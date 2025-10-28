import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { ThemedButton } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";
import { useAuthStore } from "../../../store/authStore";
import { useNotification } from "../../../contexts/NotificationContext";

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

export default function EmailVerificationScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user, setUser } = useAuthStore();
  const { showNotification } = useNotification();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hiddenInputRef = useRef<TextInput>(null);

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
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown, resending, submitting]);

  const handleHiddenInputChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    // Fill all digits
    for (let i = 0; i < 6; i++) {
      newCode[i] = digits[i] || "";
    }
    
    setCode(newCode);
    
    // Focus the next empty input
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    // Redirect to hidden input for continuous typing
    const currentCode = code.join("");
    const newCode = currentCode.split("");
    newCode[index] = value.replace(/\D/g, '').slice(-1);
    
    handleHiddenInputChange(newCode.join(""));
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      const currentCode = code.join("");
      const newCode = currentCode.slice(0, -1);
      handleHiddenInputChange(newCode);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      showNotification({
        type: "warning",
        title: "Mã xác minh không hợp lệ",
        message: "Vui lòng nhập đầy đủ 6 chữ số",
        duration: 3000,
      });
      return;
    }

    setSubmitting(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (!user?.email) {
        Alert.alert("Lỗi", "Không tìm thấy email người dùng");
        return;
      }
      const res = await AuthService.verifyEmail(user.email, verificationCode);
      if (res.success) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        navigation.replace("PinSetup");
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
        setCooldown(30);
        showNotification({
          type: "success",
          title: "Đã gửi lại mã",
          message: "Mã xác minh mới đã được gửi tới email của bạn",
          duration: 3000,
        });
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
    <SafeAreaView style={styles.container}>
      <View style={styles.keyboardContainer}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="email-check" 
            size={60} 
            color="#5D7B6F" 
          />
          <Text style={styles.title}>Xác minh Email</Text>
          <Text style={styles.subtitle}>
            Nhập mã 6 chữ số đã gửi tới{'\n'}
            <Text style={styles.emailText}>{email ? maskEmail(email) : "email của bạn"}</Text>
          </Text>
        </View>

        {/* Hidden Input for continuous typing */}
        <TextInput
          ref={hiddenInputRef}
          style={styles.hiddenInput}
          value={code.join("")}
          onChangeText={handleHiddenInputChange}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          selectTextOnFocus
          caretHidden={false}
        />

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : null,
              ]}
              onPress={() => {
                // Focus hidden input first
                hiddenInputRef.current?.focus();
                
                // Position cursor at the right place by clearing from current position
                const currentCode = code.join("");
                const newCode = currentCode.split("");
                
                // Clear from current index to end
                for (let i = index; i < 6; i++) {
                  newCode[i] = "";
                }
                
                handleHiddenInputChange(newCode.join(""));
              }}
            >
              <Text style={styles.codeInputText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            title={submitting ? "Đang xác minh..." : "Xác minh"}
            onPress={handleVerify}
            disabled={code.join("").length !== 6 || submitting}
            style={styles.verifyButton}
          />
        </View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Không nhận được mã?
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={cooldown > 0 || resending}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendButtonText,
              (cooldown > 0 || resending) && styles.resendButtonTextDisabled
            ]}>
              {resending 
                ? "Đang gửi..." 
                : cooldown > 0 
                  ? `Gửi lại sau ${cooldown}s` 
                  : "Gửi lại mã"
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Mã xác minh có hiệu lực trong 10 phút
          </Text>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8f9",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  emailText: {
    fontWeight: "600",
    color: "#5D7B6F",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    gap: 12,
  },
  hiddenInput: {
    position: "absolute",
    left: -9999,
    opacity: 0,
    height: 1,
    width: 1,
    fontSize: 1,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  codeInputFilled: {
    borderColor: "#5D7B6F",
    backgroundColor: "#f0f8f0",
  },
  codeInputText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },
  buttonContainer: {
    marginBottom: 30,
  },
  verifyButton: {
    height: 50,
    borderRadius: 12,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: "#5D7B6F",
    fontWeight: "600",
  },
  resendButtonTextDisabled: {
    color: "#999",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});