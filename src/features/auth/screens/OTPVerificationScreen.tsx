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

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export default function OTPVerificationScreen({ route, navigation }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
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

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    // TODO: Implement actual OTP verification
    Alert.alert("Success", "OTP verification functionality to be implemented");
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    setTimer(60);
    setCanResend(false);
    Alert.alert("OTP Sent", "A new OTP has been sent to your phone");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {phone}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
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
          <Text style={styles.primaryButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Change Phone Number</Text>
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
