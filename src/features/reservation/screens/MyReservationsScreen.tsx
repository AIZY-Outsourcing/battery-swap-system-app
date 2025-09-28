import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainTabParamList } from "../../../navigation/types";
import { mockReservations } from "../../../data/mockData";
import type { Reservation } from "../../../data/mockData";

type Props = NativeStackScreenProps<MainTabParamList, "MyReservations">;

export default function MyReservationsScreen({ navigation }: Props) {
  const activeReservations = mockReservations.filter(
    (r) => r.status === "active"
  );
  const pastReservations = mockReservations.filter(
    (r) => r.status !== "active"
  );

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert("Hủy đặt pin", "Bạn có chắc chắn muốn hủy đặt pin này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy đặt",
        style: "destructive",
        onPress: () => {
          // TODO: Implement cancel reservation logic
          Alert.alert("Thành công", "Đã hủy đặt pin thành công!");
        },
      },
    ]);
  };

  const renderReservationItem = ({ item }: { item: Reservation }) => {
    const isActive = item.status === "active";
    const timeRemaining = isActive
      ? Math.max(
          0,
          Math.floor((item.expiredAt.getTime() - Date.now()) / (1000 * 60))
        )
      : 0;

    return (
      <View
        style={[
          styles.reservationCard,
          isActive ? styles.activeCard : styles.pastCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.stationName}>{item.stationName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.batteryType}>Loại pin: {item.batteryType}</Text>
          <Text style={styles.reservedTime}>
            Đặt lúc: {item.reservedAt.toLocaleString("vi-VN")}
          </Text>
          {isActive && (
            <Text style={styles.expiredTime}>
              Thời gian còn lại: {timeRemaining} phút
            </Text>
          )}
        </View>

        {isActive && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(item.id)}
            >
              <Text style={styles.cancelButtonText}>Hủy đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => {
                // TODO: Navigate to station or show directions
                Alert.alert("Chỉ đường", "Mở ứng dụng bản đồ để đi đến trạm?");
              }}
            >
              <Text style={styles.navigationButtonText}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "expired":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang chờ";
      case "completed":
        return "Hoàn thành";
      case "expired":
        return "Hết hạn";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt trước của tôi</Text>
      </View>

      <View style={styles.content}>
        {activeReservations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Đang chờ</Text>
            <FlatList
              data={activeReservations}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {pastReservations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Lịch sử</Text>
            <FlatList
              data={pastReservations}
              renderItem={renderReservationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {mockReservations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Chưa có lịch đặt pin nào</Text>
            <TouchableOpacity
              style={styles.findStationButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.findStationButtonText}>Tìm trạm đổi pin</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 12,
  },
  reservationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  activeCard: {
    borderLeftColor: "#5D7B6F",
  },
  pastCard: {
    borderLeftColor: "#666666",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#000000",
  },
  cardBody: {
    marginBottom: 12,
  },
  batteryType: {
    fontSize: 14,
    color: "#5D7B6F",
    marginBottom: 4,
    fontWeight: "500",
  },
  reservedTime: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
  expiredTime: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: "#5D7B6F",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  navigationButtonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 20,
    textAlign: "center",
  },
  findStationButton: {
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  findStationButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
