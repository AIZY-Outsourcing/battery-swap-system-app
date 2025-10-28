import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import VehicleService, {
  VehicleModelOptions,
  BatteryTypeOptions,
} from "../../../services/api/VehicleService";
import AuthLayout from "../components/AuthLayout";
import { ThemedButton, ThemedCard } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";
import { useAuthStore } from "../../../store/authStore";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "VehicleSetup">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function VehicleSetupScreen({ navigation }: Props) {
  const theme = useTheme();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [vin, setVin] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [manufacturerYear, setManufacturerYear] = useState("");
  const [vehicleModelId, setVehicleModelId] = useState("");
  const [batteryTypeId, setBatteryTypeId] = useState("");

  const [vehicleModels, setVehicleModels] = useState<VehicleModelOptions>({});
  const [batteryTypes, setBatteryTypes] = useState<BatteryTypeOptions>({});
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showBatteryPicker, setShowBatteryPicker] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [modelsRes, batteryRes] = await Promise.all([
        VehicleService.getVehicleModelOptions(),
        VehicleService.getBatteryTypeOptions(),
      ]);

      if (__DEV__) {
        console.log("[VehicleSetupScreen] modelsRes:", modelsRes);
        console.log("[VehicleSetupScreen] batteryRes:", batteryRes);
      }

      if (modelsRes.success) setVehicleModels(modelsRes.data || {});
      if (batteryRes.success) setBatteryTypes(batteryRes.data || {});

      // Fallback to mock data if no options returned (for development)
      const hasModels =
        modelsRes.success && Object.keys(modelsRes.data || {}).length > 0;
      const hasBatteries =
        batteryRes.success && Object.keys(batteryRes.data || {}).length > 0;

      if (__DEV__) {
        console.log(
          "[VehicleSetupScreen] vehicleModels count:",
          Object.keys(modelsRes.data || {}).length
        );
        console.log(
          "[VehicleSetupScreen] batteryTypes count:",
          Object.keys(batteryRes.data || {}).length
        );

        if (!hasModels || !hasBatteries) {
          console.warn(
            "[VehicleSetupScreen] Using mock data because API returned empty options"
          );
          if (!hasModels) {
            const mockModels = {
              "1": "VinFast VF e34",
              "2": "VinFast VF 5",
              "3": "VinFast VF 8",
              "4": "VinFast VF 9",
            };
            setVehicleModels(mockModels);
          }
          if (!hasBatteries) {
            const mockBatteries = {
              "1": "Lithium-ion 42 kWh",
              "2": "Lithium-ion 87.7 kWh",
              "3": "Lithium-ion 123 kWh",
            };
            setBatteryTypes(mockBatteries);
          }
        }
      }
    } catch (err) {
      if (__DEV__) {
        console.log("[VehicleSetupScreen] loadOptions error:", err);
      }
      Alert.alert("Lỗi", "Không thể tải thông tin xe. Vui lòng thử lại.");
    } finally {
      setLoadingOptions(false);
    }
  };

  const fillTestData = () => {
    setName("VinFast VF8");
    setVin("VF82345678901234");
    setPlateNumber("30A-12345");
    setManufacturerYear("2023");
    const modelIds = Object.keys(vehicleModels);
    const batteryIds = Object.keys(batteryTypes);
    if (modelIds.length) setVehicleModelId(modelIds[0]);
    if (batteryIds.length) setBatteryTypeId(batteryIds[0]);
  };

  const handleSubmit = async () => {
    if (!name || !vin || !plateNumber || !vehicleModelId || !batteryTypeId) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (vin.length < 12 || vin.length > 17) {
      Alert.alert("Lỗi", "VIN phải có từ 12 đến 17 ký tự");
      return;
    }

    setSubmitting(true);

    try {
      const userData = await AuthService.getCurrentUser();
      if (!userData) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại", [
          { text: "Đăng nhập", onPress: () => navigation.replace("Login") },
        ]);
        return;
      }

      if (__DEV__) {
        console.log("[VehicleSetupScreen] Submitting vehicle data...");
      }

      const createRes = await VehicleService.createVehicleAndStore({
        name,
        vin,
        plate_number: plateNumber,
        manufacturer_year:
          manufacturerYear || new Date().getFullYear().toString(),
        battery_type_id: batteryTypeId,
        vehicle_model_id: vehicleModelId,
      });

      if (__DEV__) {
        console.log("[VehicleSetupScreen] createRes:", createRes);
      }

      if (!createRes.success) {
        const errorMsg =
          createRes.error?.message || "Không thể tạo phương tiện";
        Alert.alert(
          "Lỗi tạo xe",
          errorMsg +
            "\n\nVui lòng kiểm tra:\n- Kết nối mạng\n- Backend server đã chạy\n- Endpoint /vehicles đã có",
          [
            { text: "Thử lại", style: "default" },
            {
              text: "Bỏ qua & Vào App",
              style: "cancel",
              onPress: () => {
                navigation.getParent()?.reset({
                  index: 0,
                  routes: [{ name: "AppStack" } as any],
                });
              },
            },
          ]
        );
        return;
      }

      // Update authStore with the new vehicle data
      const updatedUser = await AuthService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }

      // Navigate to main app
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "AppStack" } as any],
      });
    } catch (error) {
      if (__DEV__) {
        console.log("[VehicleSetupScreen] handleSubmit error:", error);
      }
      Alert.alert("Lỗi", "Không thể liên kết thông tin xe. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <AuthLayout title="Liên kết thông tin xe" subtitle="Đang tải...">
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </AuthLayout>
    );
  }

  const vehicleModelList = Object.entries(vehicleModels);
  const batteryTypeList = Object.entries(batteryTypes);

  if (__DEV__) {
    console.log("[VehicleSetupScreen] rendering with:", {
      vehicleModelList: vehicleModelList.length,
      batteryTypeList: batteryTypeList.length,
    });
  }

  return (
    <AuthLayout
      title="Liên kết thông tin xe"
      subtitle="Nhập thông tin để xác định loại pin phù hợp"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedCard>
          <View style={{ gap: theme.spacing[4] }}>
            {__DEV__ && (
              <ThemedButton
                title="🚗 Điền dữ liệu test"
                onPress={fillTestData}
                variant="secondary"
                fullWidth
              />
            )}

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
                Tên xe <Text style={{ color: theme.colors.error }}>*</Text>
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
                value={name}
                onChangeText={setName}
                placeholder="VD: VinFast VF8"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
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
                placeholder="Nhập mã VIN (12-17 ký tự)"
                autoCapitalize="characters"
                maxLength={17}
                placeholderTextColor={theme.colors.text.tertiary}
              />
              <Text
                style={[styles.hint, { color: theme.colors.text.secondary }]}
              >
                VIN là mã định danh duy nhất của xe (12-17 ký tự)
              </Text>
            </View>

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
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
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="VD: 30A-12345"
                autoCapitalize="characters"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
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
                value={manufacturerYear}
                onChangeText={setManufacturerYear}
                placeholder="VD: 2023"
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
                Model xe <Text style={{ color: theme.colors.error }}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    borderColor: theme.colors.border.default,
                    backgroundColor: theme.colors.surface.default,
                  },
                ]}
                onPress={() => setShowModelPicker(true)}
              >
                <Text
                  style={{
                    color: vehicleModelId
                      ? theme.colors.text.primary
                      : theme.colors.text.tertiary,
                    flex: 1,
                  }}
                >
                  {vehicleModelId
                    ? vehicleModels[vehicleModelId]
                    : "Chọn model xe"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={{ gap: theme.spacing[2] }}>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
                Loại pin <Text style={{ color: theme.colors.error }}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    borderColor: theme.colors.border.default,
                    backgroundColor: theme.colors.surface.default,
                  },
                ]}
                onPress={() => setShowBatteryPicker(true)}
              >
                <Text
                  style={{
                    color: batteryTypeId
                      ? theme.colors.text.primary
                      : theme.colors.text.tertiary,
                    flex: 1,
                  }}
                >
                  {batteryTypeId
                    ? batteryTypes[batteryTypeId]
                    : "Chọn loại pin"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <ThemedButton
              title={submitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              onPress={handleSubmit}
              disabled={submitting}
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

        {/* Vehicle Model Picker Modal */}
        <Modal
          visible={showModelPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModelPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowModelPicker(false)}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface.default },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.colors.border.default },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Chọn Model Xe
                </Text>
                <TouchableOpacity onPress={() => setShowModelPicker(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {vehicleModelList.map(([id, label]) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.modalOption,
                      {
                        backgroundColor:
                          vehicleModelId === id
                            ? theme.colors.surface.elevated
                            : "transparent",
                        borderBottomColor: theme.colors.border.default,
                      },
                    ]}
                    onPress={() => {
                      setVehicleModelId(id);
                      setShowModelPicker(false);
                    }}
                  >
                    <Text
                      style={{
                        color:
                          vehicleModelId === id
                            ? theme.colors.primary
                            : theme.colors.text.primary,
                        fontWeight: vehicleModelId === id ? "600" : "400",
                        fontSize: 16,
                      }}
                    >
                      {label}
                    </Text>
                    {vehicleModelId === id && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>

        {/* Battery Type Picker Modal */}
        <Modal
          visible={showBatteryPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBatteryPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowBatteryPicker(false)}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface.default },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.colors.border.default },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Chọn Loại Pin
                </Text>
                <TouchableOpacity onPress={() => setShowBatteryPicker(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {batteryTypeList.map(([id, label]) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.modalOption,
                      {
                        backgroundColor:
                          batteryTypeId === id
                            ? theme.colors.surface.elevated
                            : "transparent",
                        borderBottomColor: theme.colors.border.default,
                      },
                    ]}
                    onPress={() => {
                      setBatteryTypeId(id);
                      setShowBatteryPicker(false);
                    }}
                  >
                    <Text
                      style={{
                        color:
                          batteryTypeId === id
                            ? theme.colors.primary
                            : theme.colors.text.primary,
                        fontWeight: batteryTypeId === id ? "600" : "400",
                        fontSize: 16,
                      }}
                    >
                      {label}
                    </Text>
                    {batteryTypeId === id && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
});
