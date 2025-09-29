import React, { useState } from "react";
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
import { vehicleModels } from "../../../data/mockData";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import VehicleService from "../../../services/api/VehicleService";
import AuthLayout from "../components/AuthLayout";
import { ThemedButton, ThemedCard } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "VehicleSetup">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function VehicleSetupScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [vehicleModel, setVehicleModel] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick test function
  const fillTestData = () => {
    setVehicleModel("VinFast VF8");
    setYearOfManufacture("2023");
    setLicensePlate("30A-12345");
    setVin("VF8234567890123");
  };

  const handleSubmit = async () => {
    // Validation
    if (!vehicleModel || !licensePlate || !vin) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    // VIN validation (basic)
    if (vin.length < 10) {
      Alert.alert("Lỗi", "VIN phải có ít nhất 10 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Verify user is logged in
      const userData = await AuthService.getCurrentUser();
      if (!userData) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại", [
          { text: "Đăng nhập", onPress: () => navigation.replace("Login") },
        ]);
        return;
      }

      // Get battery type from selected model
      const selectedModel = vehicleModels.find((m) => m.model === vehicleModel);
      const batteryTypeCode = selectedModel?.batteryType || "A";

      // For now, map battery code to UUID - in real app this should come from a battery types API
      const batteryTypeIdMap: Record<string, string> = {
        A: "550e8400-e29b-41d4-a716-446655440001",
        B: "550e8400-e29b-41d4-a716-446655440002",
        C: "550e8400-e29b-41d4-a716-446655440003",
      };
      const batteryTypeId =
        batteryTypeIdMap[batteryTypeCode] || batteryTypeIdMap["A"];

      // Call real API create vehicle
      const createRes = await VehicleService.createVehicleAndStore({
        name: vehicleModel,
        vin,
        plate_number: licensePlate,
        manufacturer_year:
          yearOfManufacture || new Date().getFullYear().toString(),
        battery_type_id: batteryTypeId,
      });
      if (!createRes.success) {
        Alert.alert(
          "Lỗi",
          createRes.error?.message || "Không thể tạo phương tiện"
        );
        return;
      }

      Alert.alert(
        "Thành công",
        `Đã đăng ký xe ${vehicleModel}!\nLoại pin: ${batteryTypeCode}`,
        [
          {
            text: "Hoàn thành & Vào App",
            onPress: () => {
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: "AppStack" } as any],
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể liên kết thông tin xe. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Liên kết thông tin xe"
      subtitle="Nhập thông tin để xác định loại pin phù hợp"
    >
      <ThemedCard>
        <View style={{ gap: theme.spacing[5] }}>
          {__DEV__ && (
            <ThemedButton
              title="🚗 Điền dữ liệu test (VF8)"
              onPress={fillTestData}
              variant="secondary"
              fullWidth
            />
          )}
          <View style={{ gap: theme.spacing[3] }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium as any,
                color: theme.colors.text.primary,
              }}
            >
              Model xe <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <View style={{ gap: theme.spacing[2] }}>
              {vehicleModels.map((model) => {
                const selected = vehicleModel === model.model;
                return (
                  <TouchableOpacity
                    key={model.model}
                    style={[
                      styles.modelOption,
                      {
                        borderColor: selected
                          ? theme.colors.border.focused
                          : theme.colors.border.default,
                        backgroundColor: selected
                          ? theme.colors.surface.elevated
                          : theme.colors.surface.default,
                        padding: theme.spacing[3],
                        borderRadius: theme.borderRadius.base,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setVehicleModel(model.model)}
                  >
                    <Text
                      style={{
                        color: selected
                          ? theme.colors.primary
                          : theme.colors.text.primary,
                        fontWeight: selected
                          ? (theme.typography.fontWeight.semibold as any)
                          : (theme.typography.fontWeight.normal as any),
                      }}
                    >
                      {model.model} (Pin {model.batteryType})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={{ gap: theme.spacing[2] }}>
            <Text style={{ color: theme.colors.text.primary }}>
              Năm sản xuất
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.surface.default,
                  color: theme.colors.text.primary,
                },
              ]}
              value={yearOfManufacture}
              onChangeText={setYearOfManufacture}
              placeholder="VD: 2023"
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>
          <View style={{ gap: theme.spacing[2] }}>
            <Text style={{ color: theme.colors.text.primary }}>
              Biển số xe <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.surface.default,
                  color: theme.colors.text.primary,
                },
              ]}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="VD: 30A-12345"
              autoCapitalize="characters"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>
          <View style={{ gap: theme.spacing[2] }}>
            <Text style={{ color: theme.colors.text.primary }}>
              VIN <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.surface.default,
                  color: theme.colors.text.primary,
                },
              ]}
              value={vin}
              onChangeText={setVin}
              placeholder="Nhập mã VIN của xe"
              autoCapitalize="characters"
              maxLength={17}
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
              }}
            >
              VIN là mã định danh duy nhất của xe (thường 17 ký tự)
            </Text>
          </View>
          {vehicleModel && (
            <View
              style={{
                backgroundColor: theme.colors.accent,
                padding: theme.spacing[4],
                borderRadius: theme.borderRadius.base,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium as any,
                  marginBottom: theme.spacing[1],
                  color: theme.colors.text.primary,
                }}
              >
                Thông tin pin
              </Text>
              <Text style={{ color: theme.colors.text.secondary }}>
                Xe {vehicleModel} sử dụng pin loại{" "}
                <Text style={{ fontWeight: "700" }}>
                  {
                    vehicleModels.find((m) => m.model === vehicleModel)
                      ?.batteryType
                  }
                </Text>
              </Text>
            </View>
          )}
          <ThemedButton
            title={loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
            onPress={handleSubmit}
            disabled={loading}
            fullWidth
          />
          <ThemedButton
            title="Bỏ qua (vào trang chính)"
            onPress={() => {
              navigation
                .getParent()
                ?.reset({ index: 0, routes: [{ name: "AppStack" } as any] });
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
    fontSize: 16,
  },
  modelOption: {},
});
