import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as VehicleService from "../../../services/api/VehicleService";

type Props = NativeStackScreenProps<AppStackParamList, "EditVehicle">;

interface Vehicle {
  id: string;
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year?: string;
  battery_type_id?: string;
  vehicle_model_id?: string;
}

export default function EditVehicleScreen({ route, navigation }: Props) {
  const { vehicleId } = route.params;
  const [name, setName] = useState("");
  const [vin, setVin] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [manufacturerYear, setManufacturerYear] = useState("");
  const [vehicleModelId, setVehicleModelId] = useState("");
  const [batteryTypeId, setBatteryTypeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [vehicleModels, setVehicleModels] = useState<Record<string, string>>(
    {}
  );
  const [batteryTypes, setBatteryTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [vehicleId]);

  const loadData = async () => {
    try {
      const [vehicleRes, modelsRes, batteriesRes] = await Promise.all([
        VehicleService.getVehicleById(vehicleId),
        VehicleService.getVehicleModelOptions(),
        VehicleService.getBatteryTypeOptions(),
      ]);

      if (vehicleRes.success && vehicleRes.data) {
        const vehicle = vehicleRes.data;
        setName(vehicle.name);
        setVin(vehicle.vin);
        setPlateNumber(vehicle.plate_number);
        setManufacturerYear(vehicle.manufacturer_year || "");
        setVehicleModelId(vehicle.vehicle_model_id || "");
        setBatteryTypeId(vehicle.battery_type_id || "");
      } else {
        Alert.alert("Lỗi", "Không thể tải thông tin xe");
        navigation.goBack();
        return;
      }

      if (modelsRes.success && modelsRes.data) {
        setVehicleModels(modelsRes.data);
      }

      if (batteriesRes.success && batteriesRes.data) {
        setBatteryTypes(batteriesRes.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
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
      const response = await VehicleService.updateVehicle(vehicleId, {
        name,
        vin,
        plate_number: plateNumber,
        manufacturer_year:
          manufacturerYear || new Date().getFullYear().toString(),
        battery_type_id: batteryTypeId,
        vehicle_model_id: vehicleModelId,
      });

      if (response.success) {
        Alert.alert("Thành công", "Đã cập nhật xe thành công", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Lỗi", response.error?.message || "Không thể cập nhật xe");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert("Lỗi", "Không thể cập nhật xe");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tên xe <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="VD: VinFast VF8"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* VIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              VIN <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={vin}
              onChangeText={setVin}
              placeholder="12-17 ký tự"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          {/* Plate Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Biển số <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="VD: 30A-12345"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
            />
          </View>

          {/* Manufacturer Year */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Năm sản xuất</Text>
            <TextInput
              style={styles.input}
              value={manufacturerYear}
              onChangeText={setManufacturerYear}
              placeholder={new Date().getFullYear().toString()}
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          {/* Vehicle Model */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mẫu xe <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                const options = Object.entries(vehicleModels).map(
                  ([id, name]) => ({
                    text: name,
                    onPress: () => setVehicleModelId(id),
                  })
                );
                options.push({ text: "Hủy", onPress: () => {} });
                Alert.alert("Chọn mẫu xe", undefined, options);
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !vehicleModelId && styles.dropdownPlaceholder,
                ]}
              >
                {vehicleModelId ? vehicleModels[vehicleModelId] : "Chọn mẫu xe"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* Battery Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Loại pin <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                const options = Object.entries(batteryTypes).map(
                  ([id, name]) => ({
                    text: name,
                    onPress: () => setBatteryTypeId(id),
                  })
                );
                options.push({ text: "Hủy", onPress: () => {} });
                Alert.alert("Chọn loại pin", undefined, options);
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !batteryTypeId && styles.dropdownPlaceholder,
                ]}
              >
                {batteryTypeId ? batteryTypes[batteryTypeId] : "Chọn loại pin"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Cập nhật</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: "#1e293b",
    flex: 1,
  },
  dropdownPlaceholder: {
    color: "#94a3b8",
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  optionSelected: {
    backgroundColor: "#f0fdf4",
  },
  optionText: {
    fontSize: 16,
    color: "#64748b",
  },
  optionTextSelected: {
    color: "#5D7B6F",
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
