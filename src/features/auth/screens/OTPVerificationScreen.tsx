import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import { track } from "../../../services/analytics";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export default function OTPVerificationScreen({ route, navigation }: Props) {
  const { phone, email } = route.params as any;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    try {
      const res = await AuthService.verifyOTP(phone, otp);
      if (res.success) {
        track({ name: "otp_verified" });
        const hasToken = !!res.data?.token;
        if (hasToken && res.data?.user) {
          // Ready -> go to Main
          Alert.alert("Thành công", "Xác thực thành công", [
            {
              text: "Vào ứng dụng",
              onPress: () =>
                navigation.getParent()?.navigate("AppStack" as any),
            },
          ]);
        } else {
          // Continue to vehicle link/setup
          const userId = res.data?.user?.id || "temp";
          Alert.alert("Thành công", "Hãy tiếp tục liên kết phương tiện", [
            {
              text: "Tiếp tục",
              onPress: () => navigation.replace("VehicleSetup", { userId }),
            },
          ]);
        }
      } else {
        Alert.alert("Lỗi", res.error?.message || "Mã OTP không hợp lệ");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", e.message || "Không thể xác thực OTP");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    try {
      await AuthService.sendOTP(phone);
      track({ name: "otp_resend" });
      setTimer(300);
      setCanResend(false);
      Alert.alert("Đã gửi", "Mã OTP mới đã được gửi");
    } catch {
      Alert.alert("Lỗi", "Không thể gửi lại OTP");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xác thực mã OTP</Text>
        <Text style={styles.subtitle}>
          Mã đã gửi đến {email || phone} — nhập 6 chữ số
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.otpInput}
          placeholder="Nhập mã 6 chữ số"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyOTP}
        >
          <Text style={styles.primaryButtonText}>Xác nhận</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.timerText}>Gửi lại mã sau {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Gửi lại mã</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Thay đổi số/email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
  },
  timerText: {
    color: "#666",
    fontSize: 14,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
});
