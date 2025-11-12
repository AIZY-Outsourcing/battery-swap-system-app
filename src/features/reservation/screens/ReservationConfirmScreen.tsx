import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import { useAuthStore } from "../../../store/authStore";
import { getStationById } from "../../../services/api/StationService";
import reservationService from "../../../services/api/ReservationService";
import vehicleService, {
  type VehicleRecord,
  type BackendVehicle,
} from "../../../services/api/VehicleService";
import type { Station } from "../../../types/station";

type Props = NativeStackScreenProps<RootStackParamList, "ReservationConfirm">;

const DURATION_OPTIONS = [30, 60, 90, 120]; // minutes

export default function ReservationConfirmScreen({ navigation, route }: Props) {
  const { stationId } = route.params;
  const [station, setStation] = useState<Station | null>(null);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStation, setLoadingStation] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadStation();
    loadVehicles();
  }, [stationId]);

  const loadStation = async () => {
    try {
      setLoadingStation(true);
      const data = await getStationById(stationId);
      setStation(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin trạm");
      navigation.goBack();
    } finally {
      setLoadingStation(false);
    }
  };

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await vehicleService.getMyVehicles();

      if (response.success && response.data) {
        // Convert BackendVehicle[] to VehicleRecord[]
        const vehicleRecords: VehicleRecord[] = response.data.map((v) => ({
          id: v.id,
          name: v.name,
          vin: v.vin,
          plateNumber: v.plate_number,
          year: v.manufacturer_year,
          userId: v.user_id,
          batteryTypeId: v.battery_type_id,
          createdAt: v.created_at,
          updatedAt: v.updated_at,
        }));

        setVehicles(vehicleRecords);
        // Auto-select first vehicle if only one
        if (vehicleRecords.length === 1) {
          setSelectedVehicle(vehicleRecords[0]);
        }
      } else {
        Alert.alert(
          "Lỗi",
          response.error?.message ||
            "Không thể tải danh sách xe. Vui lòng đăng ký xe trước."
        );
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách xe. Vui lòng đăng ký xe trước."
      );
      navigation.goBack();
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!station) return;

    if (!selectedVehicle) {
      Alert.alert("Thông báo", "Vui lòng chọn xe để đặt pin!");
      return;
    }

    Alert.alert(
      "Xác nhận đặt pin",
      `Bạn có chắc chắn muốn đặt pin tại ${station.name}?\n\nXe: ${selectedVehicle.name}\nThời gian giữ chỗ: ${selectedDuration} phút\n\nHệ thống sẽ tự động chọn pin phù hợp với xe của bạn.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await reservationService.createReservation({
                station_id: String(station.id),
                vehicle_id: selectedVehicle.id,
                duration_minutes: selectedDuration,
              });

              Alert.alert(
                "Đặt pin thành công!",
                `Pin đã được đặt tại ${station.name}.\n\nVui lòng đến trạm trong vòng ${selectedDuration} phút để không bị hủy tự động.`,
                [
                  {
                    text: "Về trang chủ",
                    onPress: () => {
                      navigation.navigate("MainTabs", {
                        screen: "Home",
                      } as any);
                    },
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                "Lỗi",
                error.response?.data?.message ||
                  error.message ||
                  "Không thể đặt pin. Vui lòng thử lại!"
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt trước pin</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loadingStation || loadingVehicles ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      ) : !station || vehicles.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {!station
              ? "Không thể tải thông tin trạm"
              : "Bạn chưa có xe nào. Vui lòng đăng ký xe trước."}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Station Info */}
            <View style={styles.stationCard}>
              <View style={styles.stationHeader}>
                <Text style={styles.stationName}>{station.name}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {station.available && station.available > 0
                      ? "Có sẵn"
                      : "Hết pin"}
                  </Text>
                </View>
              </View>
              <Text style={styles.stationAddress}>{station.address}</Text>
              {station.city && (
                <Text style={styles.stationCity}>🏙️ {station.city}</Text>
              )}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {station.distanceKm && (
                  <Text style={styles.stationDistance}>
                    📍 {station.distanceKm.toFixed(1)} km •{" "}
                  </Text>
                )}
                <MaterialCommunityIcons
                  name="battery-charging-medium"
                  size={14}
                  color="#4ade80"
                />
                <Text style={styles.stationDistance}>
                  {" "}
                  {station.available || 0} pin có sẵn
                </Text>
              </View>
            </View>

            {/* User Info */}
            {/* {user && (
              <View style={styles.userCard}>
                <Text style={styles.userTitle}>Thông tin xe của bạn</Text>
                <Text style={styles.userText}>
                  📱 {user.phone || user.email}
                </Text>
                <Text style={styles.userNote}>
                  💡 Hệ thống sẽ tự động chọn pin phù hợp với xe của bạn
                </Text>
              </View>
            )} */}

            {/* Vehicle Selection */}
            {vehicles.length > 0 && (
              <View style={styles.vehicleSection}>
                <Text style={styles.sectionTitle}>Chọn xe</Text>
                {vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.vehicleOption,
                      selectedVehicle?.id === vehicle.id &&
                        styles.selectedVehicle,
                    ]}
                    onPress={() => setSelectedVehicle(vehicle)}
                  >
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleName}>🏍️ {vehicle.name}</Text>
                      <Text style={styles.vehiclePlate}>
                        {vehicle.plateNumber}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        selectedVehicle?.id === vehicle.id &&
                          styles.radioSelected,
                      ]}
                    >
                      {selectedVehicle?.id === vehicle.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Duration Selection */}
            <View style={styles.durationSection}>
              <Text style={styles.sectionTitle}>Thời gian giữ chỗ</Text>
              <View style={styles.durationOptions}>
                {DURATION_OPTIONS.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      selectedDuration === duration && styles.selectedDuration,
                    ]}
                    onPress={() => setSelectedDuration(duration)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selectedDuration === duration &&
                          styles.selectedDurationText,
                      ]}
                    >
                      {duration} phút
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Terms */}
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Điều khoản đặt trước</Text>
              <Text style={styles.termsText}>
                • Thời gian giữ chỗ: {selectedDuration} phút kể từ khi đặt
                {"\n"}• Phí đặt trước: Miễn phí{"\n"}• Hủy đặt chỗ: Có thể hủy
                miễn phí trước khi hết hạn{"\n"}• Pin sẽ tự động hủy nếu quá
                thời gian
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>
                {selectedVehicle ? `Xe: ${selectedVehicle.name} • ` : ""}
                Thời gian: {selectedDuration} phút
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (isLoading ||
                  !selectedVehicle ||
                  !station.available ||
                  station.available <= 0) &&
                  styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmReservation}
              disabled={
                isLoading ||
                !selectedVehicle ||
                !station.available ||
                station.available <= 0
              }
            >
              <Text style={styles.confirmButtonText}>
                {isLoading
                  ? "Đang xử lý..."
                  : !selectedVehicle
                  ? "Chọn xe để tiếp tục"
                  : !station.available || station.available <= 0
                  ? "Hết pin"
                  : "Xác nhận đặt pin"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerSpacer: {
    width: 28, // Same width as back button icon
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#ffffff",
  },
  stationAddress: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  stationCity: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },
  stationDistance: {
    fontSize: 12,
    color: "#5D7B6F",
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  userText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  userNote: {
    fontSize: 12,
    color: "#5D7B6F",
    fontStyle: "italic",
    marginTop: 4,
  },
  vehicleSection: {
    marginBottom: 16,
  },
  vehicleOption: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedVehicle: {
    borderColor: "#5D7B6F",
    backgroundColor: "#f0f5f0",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: "#666666",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#5D7B6F",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#5D7B6F",
  },
  durationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  durationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationOption: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedDuration: {
    borderColor: "#5D7B6F",
    backgroundColor: "#f0f5f0",
  },
  durationText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  selectedDurationText: {
    color: "#5D7B6F",
    fontWeight: "600",
  },
  termsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
  },
  bottomActions: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  selectedInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  selectedText: {
    fontSize: 14,
    color: "#5D7B6F",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#5D7B6F",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
