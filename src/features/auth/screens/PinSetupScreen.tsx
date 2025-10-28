import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import AuthLayout from "../components/AuthLayout";
import { ThemedButton, ThemedCard } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "PinSetup">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function PinSetupScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      Alert.alert("Lỗi", "Mã PIN phải có đúng 6 chữ số");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("Lỗi", "Mã PIN xác nhận không khớp");
      return;
    }

    setSubmitting(true);

    try {
      const res = await AuthService.setup2FA(pin);
      if (!res.success) {
        Alert.alert("Lỗi", res.error?.message || "Không thể tạo mã PIN");
        return;
      }

      // Check if vehicle setup needed
      const hasVehicle = await AuthService.hasCompletedVehicleSetup();
      if (!hasVehicle) {
        navigation.replace("VehicleSetup");
      } else {
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: "AppStack" } as any],
        });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo mã PIN. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo mã PIN bảo mật"
      subtitle="Mã PIN 6 số để xác thực giao dịch"
    >
      <ThemedCard>
        <View style={{ gap: theme.spacing[4] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Mã PIN <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.surface.default,
                  color: theme.colors.text.primary,
                  fontSize: 24,
                  letterSpacing: 8,
                  textAlign: "center",
                },
              ]}
              value={pin}
              onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
              placeholder="• • • • • •"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={[styles.hint, { color: theme.colors.text.secondary }]}>
              Nhập 6 chữ số
            </Text>
          </View>

          <View style={{ gap: theme.spacing[2] }}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Xác nhận mã PIN{" "}
              <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.surface.default,
                  color: theme.colors.text.primary,
                  fontSize: 24,
                  letterSpacing: 8,
                  textAlign: "center",
                },
              ]}
              value={confirmPin}
              onChangeText={(text) =>
                setConfirmPin(text.replace(/[^0-9]/g, ""))
              }
              placeholder="• • • • • •"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={[styles.hint, { color: theme.colors.text.secondary }]}>
              Nhập lại mã PIN
            </Text>
          </View>

          <ThemedButton
            title={submitting ? "Đang xử lý..." : "Tạo mã PIN"}
            onPress={handleSubmit}
            disabled={submitting || pin.length !== 6 || confirmPin.length !== 6}
            fullWidth
          />

          <ThemedButton
            title="Bỏ qua"
            onPress={async () => {
              const hasVehicle = await AuthService.hasCompletedVehicleSetup();
              if (!hasVehicle) {
                navigation.replace("VehicleSetup");
              } else {
                navigation.getParent()?.reset({
                  index: 0,
                  routes: [{ name: "AppStack" } as any],
                });
              }
            }}
            variant="tertiary"
            fullWidth
          />
        </View>
      </ThemedCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
  },
});
