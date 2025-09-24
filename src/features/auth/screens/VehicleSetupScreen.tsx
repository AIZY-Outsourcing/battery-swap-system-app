import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { vehicleModels } from "../../../data/mockData";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/types";
import AuthService from "../../../services/auth/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "VehicleSetup">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function VehicleSetupScreen({ navigation, route }: Props) {
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
      // Ensure user exists in AsyncStorage (for dev/test)
      const userData = await AuthService.getCurrentUser();
      if (!userData) {
        const mockUser = {
          id: "test-user",
          firstName: "Test",
          lastName: "User",
          email: "test@bss.com",
          phone: "0123456789",
          createdAt: new Date().toISOString(),
          membershipLevel: "bronze",
        };
        await AuthService.clearAuth();
        await AsyncStorage.setItem(
          (AuthService as any).constructor.USER_KEY,
          JSON.stringify(mockUser)
        );
      }

      // Get battery type from selected model
      const selectedModel = vehicleModels.find((m) => m.model === vehicleModel);
      const batteryType = selectedModel?.batteryType || "A";

      // Save vehicle info to AuthService
      await AuthService.saveVehicleInfo({
        make: vehicleModel.split(" ")[0] || "EV",
        model: vehicleModel,
        year: yearOfManufacture || "2023",
        licensePlate: licensePlate,
        batteryType: batteryType,
      });

      Alert.alert(
        "Thành công",
        `Đã liên kết thành công xe ${vehicleModel}!\nLoại pin: ${batteryType}`,
        [
          {
            text: "Hoàn thành & Vào App",
            onPress: () => {
              // Reset root sang AppStack (AppStack tự điều hướng vào MainTabs)
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Liên kết thông tin xe</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập thông tin xe để hệ thống xác định loại pin phù hợp
        </Text>

        {/* Quick Test Button */}
        <TouchableOpacity style={styles.testButton} onPress={fillTestData}>
          <Text style={styles.testButtonText}>
            🚗 Điền dữ liệu test (VinFast VF8)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Model xe <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.modelSelector}>
            {vehicleModels.map((model) => (
              <TouchableOpacity
                key={model.model}
                style={[
                  styles.modelOption,
                  vehicleModel === model.model && styles.selectedModel,
                ]}
                onPress={() => setVehicleModel(model.model)}
              >
                <Text
                  style={[
                    styles.modelText,
                    vehicleModel === model.model && styles.selectedModelText,
                  ]}
                >
                  {model.model} (Pin {model.batteryType})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Năm sản xuất</Text>
          <TextInput
            style={styles.input}
            value={yearOfManufacture}
            onChangeText={setYearOfManufacture}
            placeholder="VD: 2023"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Biển số xe <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="VD: 30A-12345"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            VIN (Vehicle Identification Number){" "}
            <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="Nhập mã VIN của xe"
            autoCapitalize="characters"
            maxLength={17}
          />
          <Text style={styles.helperText}>
            VIN là mã định danh duy nhất của xe, thường có 17 ký tự
          </Text>
        </View>

        {vehicleModel && (
          <View style={styles.batteryInfo}>
            <Text style={styles.batteryInfoTitle}>Thông tin pin:</Text>
            <Text style={styles.batteryInfoText}>
              Xe {vehicleModel} sử dụng pin loại{" "}
              <Text style={styles.batteryType}>
                {
                  vehicleModels.find((m) => m.model === vehicleModel)
                    ?.batteryType
                }
              </Text>
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {
          // Bỏ qua: reset Root sang AppStack/MainTabs
          navigation
            .getParent()
            ?.reset({ index: 0, routes: [{ name: "AppStack" } as any] });
        }}
      >
        <Text style={styles.skipButtonText}>Bỏ qua (vào trang chính)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  modelSelector: {
    gap: 10,
  },
  modelOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  selectedModel: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  modelText: {
    fontSize: 16,
    color: "#333",
  },
  selectedModelText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    fontStyle: "italic",
  },
  batteryInfo: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  batteryInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 5,
  },
  batteryInfoText: {
    fontSize: 14,
    color: "#333",
  },
  batteryType: {
    fontWeight: "bold",
    color: "#1976D2",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 15,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  testButton: {
    backgroundColor: "#ff6b35",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
