import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import { useAuthStore } from "../../../store/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "ReservationConfirm">;

interface BatteryOption {
  id: string;
  type: "A" | "B" | "C";
  capacity: string;
  available: number;
  price: number;
}

interface Station {
  id: string;
  name: string;
  address: string;
  distance: number;
  available: number;
  batteryOptions: BatteryOption[];
}

// Mock data - in real app this would come from API
const mockStation: Station = {
  id: "1",
  name: "Trạm Cầu Giấy - A1",
  address: "123 Đường Cầu Giấy, Cầu Giấy, Hà Nội",
  distance: 1.2,
  available: 8,
  batteryOptions: [
    { id: "1", type: "A", capacity: "48V 20Ah", available: 3, price: 15000 },
    { id: "2", type: "B", capacity: "60V 20Ah", available: 3, price: 18000 },
    { id: "3", type: "C", capacity: "72V 20Ah", available: 2, price: 22000 },
  ],
};

export default function ReservationConfirmScreen({ navigation, route }: Props) {
  const { stationId } = route.params;
  const [selectedBattery, setSelectedBattery] = useState<BatteryOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const credits = useAuthStore((s) => s.user?.swapCredits ?? 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleConfirmReservation = async () => {
    if (!selectedBattery) {
      Alert.alert("Thông báo", "Vui lòng chọn loại pin!");
      return;
    }

    if (credits <= 0) {
      Alert.alert(
        "Không đủ lượt",
        "Bạn cần nạp thêm lượt đổi pin để tiếp tục!"
      );
      return;
    }

    Alert.alert(
      "Xác nhận đặt pin",
      `Bạn có chắc chắn muốn đặt pin ${selectedBattery.type} tại ${
        mockStation.name
      }?\n\nGiá: ${formatCurrency(
        selectedBattery.price
      )}\nThời gian giữ chỗ: 30 phút`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            setIsLoading(true);
            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 1500));

              Alert.alert(
                "Đặt pin thành công!",
                `Pin ${selectedBattery.type} đã được đặt tại ${mockStation.name}.\n\nVui lòng đến trạm trong vòng 30 phút để không bị hủy tự động.`,
                [
                  {
                    text: "Xem đặt chỗ",
                    onPress: () => {
                      navigation.navigate("MainTabs", {
                        screen: "MyReservations",
                      } as any);
                    },
                  },
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
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đặt pin. Vui lòng thử lại!");
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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt trước pin</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Station Info */}
        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <Text style={styles.stationName}>{mockStation.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Có sẵn</Text>
            </View>
          </View>
          <Text style={styles.stationAddress}>{mockStation.address}</Text>
          <Text style={styles.stationDistance}>
            📍 {mockStation.distance} km • 🔋 {mockStation.available} pin có sẵn
          </Text>
        </View>

        {/* Credits Info */}
        <View style={styles.creditsCard}>
          <Text style={styles.creditsTitle}>Lượt đổi pin của bạn</Text>
          <Text style={styles.creditsCount}>{credits} lượt</Text>
          {credits <= 0 && (
            <Text style={styles.creditsWarning}>
              Bạn cần nạp thêm lượt để đặt pin
            </Text>
          )}
        </View>

        {/* Battery Selection */}
        <View style={styles.batterySection}>
          <Text style={styles.sectionTitle}>Chọn loại pin</Text>
          {mockStation.batteryOptions.map((battery) => (
            <TouchableOpacity
              key={battery.id}
              style={[
                styles.batteryOption,
                selectedBattery?.id === battery.id && styles.selectedBattery,
                battery.available === 0 && styles.disabledBattery,
              ]}
              onPress={() =>
                battery.available > 0 ? setSelectedBattery(battery) : null
              }
              disabled={battery.available === 0}
            >
              <View style={styles.batteryInfo}>
                <Text style={styles.batteryType}>Pin {battery.type}</Text>
                <Text style={styles.batteryCapacity}>{battery.capacity}</Text>
                <Text style={styles.batteryAvailable}>
                  Còn lại: {battery.available} pin
                </Text>
              </View>
              <View style={styles.batteryRight}>
                <Text style={styles.batteryPrice}>
                  {formatCurrency(battery.price)}
                </Text>
                <View
                  style={[
                    styles.radioButton,
                    selectedBattery?.id === battery.id && styles.radioSelected,
                  ]}
                >
                  {selectedBattery?.id === battery.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Điều khoản đặt trước</Text>
          <Text style={styles.termsText}>
            • Thời gian giữ chỗ: 30 phút kể từ khi đặt{"\n"}• Phí đặt trước:
            Miễn phí{"\n"}• Hủy đặt chỗ: Có thể hủy miễn phí trước khi hết hạn
            {"\n"}• Pin sẽ tự động hủy nếu quá thời gian
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {selectedBattery && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>
              Pin {selectedBattery.type} •{" "}
              {formatCurrency(selectedBattery.price)}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedBattery || credits <= 0 || isLoading) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmReservation}
          disabled={!selectedBattery || credits <= 0 || isLoading}
        >
          <Text style={styles.confirmButtonText}>
            {isLoading ? "Đang xử lý..." : "Xác nhận đặt pin"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b0d4b8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerSpacer: {
    width: 40,
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
    color: "#000000",
  },
  stationAddress: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
  stationDistance: {
    fontSize: 12,
    color: "#5D7B6F",
  },
  creditsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  creditsTitle: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
  creditsCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D7B6F",
  },
  creditsWarning: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  batterySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  batteryOption: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedBattery: {
    borderColor: "#5D7B6F",
    backgroundColor: "#2a3a2a",
  },
  disabledBattery: {
    opacity: 0.5,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  batteryCapacity: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 2,
  },
  batteryAvailable: {
    fontSize: 12,
    color: "#5D7B6F",
  },
  batteryRight: {
    alignItems: "flex-end",
  },
  batteryPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D7B6F",
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666666",
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
    color: "#888888",
    lineHeight: 18,
  },
  bottomActions: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a3a",
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
    backgroundColor: "#666666",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
