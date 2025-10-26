import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "../../../services/auth/AuthService";
import StationSessionService from "../../../services/api/StationSessionService";
import Button from "../../../components/ui/Button";

interface PinVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      sessionToken: string;
      kioskId: string;
      stationId: string;
    };
  };
}

export default function PinVerificationScreen({
  navigation,
  route,
}: PinVerificationScreenProps) {
  const { sessionToken, kioskId, stationId } = route.params;
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pinInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus on PIN input when screen loads
    pinInputRef.current?.focus();
  }, []);

  const handlePinChange = (text: string) => {
    // Only allow digits and limit to 6 characters
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 6) {
      setPin(numericText);
    }
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ 6 số PIN");
      return;
    }

    setIsLoading(true);
    try {
      // Verify 2FA with PIN
      const verifyRes = await AuthService.verify2FA({
        type: "pin",
        pin: pin,
      });
      console.log(verifyRes);
      if (!verifyRes.success) {
        Alert.alert("Lỗi", verifyRes.error?.message || "PIN không đúng");
        return;
      }

      // After successful PIN verification, try QR authentication again
      const authRes = await StationSessionService.authenticateQR({
        session_token: sessionToken,
      });

      // let parsedData = authRes.data;
      // if (typeof authRes.data === "string") {
      //   try {
      //     parsedData = JSON.parse(authRes.data);
      //   } catch (e) {
      //     console.error("Failed to parse authRes.data:", e);
      //   }
      // }
      // const sessionData = (parsedData as any)?.data;
      // const isSuccess = (parsedData as any)?.success === true && sessionData;

      console.log(authRes);

      // Success! Navigate to SwapSession
      navigation.navigate("SwapSession", {
        sessionData: authRes.data,
        kioskId,
        stationId,
      });
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Xác thực PIN</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color="#5D7B6F" />
          </View>

          <Text style={styles.subtitle}>Nhập mã PIN 6 số để xác thực</Text>
          <Text style={styles.description}>
            Để bảo mật, vui lòng nhập mã PIN của bạn để tiếp tục quá trình đổi
            pin
          </Text>

          {/* PIN Input */}
          {/* PIN Dots */}
          <View style={styles.pinDots}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < pin.length && styles.pinDotFilled,
                ]}
              />
            ))}
          </View>

          {/* Hidden TextInput for keyboard */}
          <TextInput
            ref={pinInputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
            autoFocus
          />

          {/* Verify Button */}
          <Button
            title="Xác thực"
            onPress={handleVerifyPin}
            variant="primary"
            size="large"
            disabled={pin.length !== 6 || isLoading}
            loading={isLoading}
            style={StyleSheet.flatten([
              styles.verifyButton,
              pin.length !== 6 && styles.verifyButtonDisabled,
            ])}
          />

          {/* Help Text */}
          <Text style={styles.helpText}>
            Quên mã PIN? Liên hệ hỗ trợ để được hỗ trợ
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
  },
  hiddenInput: {
    position: "absolute",
    left: -9999,
    opacity: 0,
    height: 0,
    width: 0,
  },
  pinDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 16,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "transparent",
  },
  pinDotFilled: {
    backgroundColor: "#5D7B6F",
    borderColor: "#5D7B6F",
  },
  verifyButton: {
    marginBottom: 24,
    minWidth: 200,
    backgroundColor: "#5D7B6F",
  },
  verifyButtonDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.6,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
