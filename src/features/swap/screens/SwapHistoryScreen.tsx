import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme";
import SwapTransactionService, {
  SwapTransaction,
} from "../../../services/api/SwapTransactionService";

interface SwapHistoryScreenProps {
  navigation: any;
}

export const SwapHistoryScreen: React.FC<SwapHistoryScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([]);

  useEffect(() => {
    loadSwapHistory();
  }, []);

  const loadSwapHistory = async () => {
    try {
      setLoading(true);
      const transactions = await SwapTransactionService.getMySwapTransactions();
      setSwapHistory(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error("Error loading swap history:", error);
      Alert.alert(t("support.error"), t("swap.historyError"));
      setSwapHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSwapHistory();
    setRefreshing(false);
  }, []);

  const periods = [
    { id: "all", label: t("map.allStations") },
    { id: "week", label: t("common.thisWeek", { defaultValue: "Tuần này" }) },
    {
      id: "month",
      label: t("common.thisMonth", { defaultValue: "Tháng này" }),
    },
    {
      id: "quarter",
      label: t("common.threeMonths", { defaultValue: "3 tháng" }),
    },
  ];

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

  const renderSwapItem = ({ item }: { item: SwapTransaction }) => {
    const swapOrder = item.swap_order;
    const createdDate = new Date(item.created_at);
    const stationName = swapOrder?.station?.name || "Unknown Station";
    const stationAddress = swapOrder?.station?.address || "";
    const oldBatteryLevel = swapOrder?.old_battery?.soc
      ? `${swapOrder.old_battery.soc}%`
      : "N/A";
    const newBatteryLevel = swapOrder?.new_battery?.soc
      ? `${swapOrder.new_battery.soc}%`
      : "N/A";

    return (
      <TouchableOpacity
        style={styles.swapItem}
        onPress={() => {
          // Navigate to swap detail screen if needed
        }}
      >
        <View style={styles.swapHeader}>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{stationName}</Text>
            <Text style={styles.stationAddress}>{stationAddress}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.swapDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian:</Text>
            <Text style={styles.detailValue}>
              {createdDate.toLocaleString("vi-VN")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pin cũ:</Text>
            <Text style={styles.detailValue}>{oldBatteryLevel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pin mới:</Text>
            <Text style={styles.detailValue}>{newBatteryLevel}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>{t("swap.historyTitle")}</Text>
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
          <Text style={styles.statValue}>{swapHistory.length}</Text>
          <Text style={styles.statLabel}>Lần đổi</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Chi phí</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>-</Text>
          <Text style={styles.statLabel}>Thời gian TB</Text>
        </View>
      </View>

      {/* Swap History List */}
      {swapHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có lịch sử đổi pin</Text>
        </View>
      ) : (
        <FlatList
          data={swapHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderSwapItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
