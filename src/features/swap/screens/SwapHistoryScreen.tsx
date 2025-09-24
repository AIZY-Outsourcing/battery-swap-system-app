import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { theme } from "../../../theme";

interface SwapRecord {
  id: string;
  stationName: string;
  stationAddress: string;
  swapTime: string;
  date: string;
  oldBatteryLevel: string;
  newBatteryLevel: string;
  cost: string;
  duration: string;
  status: "completed" | "failed" | "cancelled";
}

interface SwapHistoryScreenProps {
  navigation: any;
}

export const SwapHistoryScreen: React.FC<SwapHistoryScreenProps> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const mockSwapHistory: SwapRecord[] = [
    {
      id: "1",
      stationName: "Vincom Bà Triệu",
      stationAddress: "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
      swapTime: "14:32",
      date: "21/12/2024",
      oldBatteryLevel: "15%",
      newBatteryLevel: "98%",
      cost: "15.000 VND",
      duration: "2 phút 45 giây",
      status: "completed",
    },
    {
      id: "2",
      stationName: "Big C Thăng Long",
      stationAddress: "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      swapTime: "09:15",
      date: "19/12/2024",
      oldBatteryLevel: "8%",
      newBatteryLevel: "95%",
      cost: "15.000 VND",
      duration: "3 phút 12 giây",
      status: "completed",
    },
    {
      id: "3",
      stationName: "Lotte Center",
      stationAddress: "54 Liễu Giai, Ba Đình, Hà Nội",
      swapTime: "16:45",
      date: "17/12/2024",
      oldBatteryLevel: "12%",
      newBatteryLevel: "0%",
      cost: "0 VND",
      duration: "1 phút 23 giây",
      status: "failed",
    },
    {
      id: "4",
      stationName: "AEON Mall Hà Đông",
      stationAddress: "Số 1 Đường Đ. Đặng Thúc Vịnh, Hà Đông, Hà Nội",
      swapTime: "11:20",
      date: "15/12/2024",
      oldBatteryLevel: "20%",
      newBatteryLevel: "20%",
      cost: "0 VND",
      duration: "45 giây",
      status: "cancelled",
    },
  ];

  const periods = [
    { id: "all", label: "Tất cả" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
    { id: "quarter", label: "3 tháng" },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "failed":
        return theme.colors.error;
      case "cancelled":
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "failed":
        return "Thất bại";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const renderSwapItem = ({ item }: { item: SwapRecord }) => (
    <TouchableOpacity
      style={styles.swapItem}
      onPress={() => {
        // Navigate to swap detail screen
        // navigation.navigate('SwapDetail', { swapId: item.id });
      }}
    >
      <View style={styles.swapHeader}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.stationName}</Text>
          <Text style={styles.stationAddress}>{item.stationAddress}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.swapDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian</Text>
          <Text style={styles.detailValue}>
            {item.swapTime} - {item.date}
          </Text>
        </View>

        {item.status === "completed" && (
          <>
            <View style={styles.batteryRow}>
              <View style={styles.batteryInfo}>
                <Text style={styles.batteryLabel}>Pin cũ</Text>
                <Text style={styles.batteryValue}>{item.oldBatteryLevel}</Text>
              </View>
              <Text style={styles.batteryArrow}>→</Text>
              <View style={styles.batteryInfo}>
                <Text style={styles.batteryLabel}>Pin mới</Text>
                <Text style={styles.batteryValue}>{item.newBatteryLevel}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thời gian đổi</Text>
              <Text style={styles.detailValue}>{item.duration}</Text>
            </View>
          </>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Chi phí</Text>
          <Text
            style={[
              styles.detailValue,
              item.status === "completed" && styles.costValue,
            ]}
          >
            {item.cost}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đổi pin</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={periods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === item.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(item.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === item.id && styles.periodButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Lần đổi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>30.000 VND</Text>
          <Text style={styles.statLabel}>Chi phí</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>2 phút 30 giây</Text>
          <Text style={styles.statLabel}>Thời gian TB</Text>
        </View>
      </View>

      {/* Swap History List */}
      <FlatList
        data={mockSwapHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderSwapItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.elevated,
    marginRight: 8,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.elevated,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  swapItem: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  swapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  swapDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: "500",
  },
  costValue: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  batteryInfo: {
    alignItems: "center",
    flex: 1,
  },
  batteryLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  batteryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  batteryArrow: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginHorizontal: 12,
  },
});
