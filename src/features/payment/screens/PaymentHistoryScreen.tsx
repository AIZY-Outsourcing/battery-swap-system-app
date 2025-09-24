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

interface PaymentRecord {
  id: string;
  type: "topup" | "swap" | "subscription" | "refund";
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
  reference?: string;
}

interface PaymentHistoryScreenProps {
  navigation: any;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const mockPaymentHistory: PaymentRecord[] = [
    {
      id: "1",
      type: "swap",
      amount: -15000,
      description: "Đổi pin tại Vincom Bà Triệu",
      timestamp: "2024-12-21 14:32:15",
      status: "completed",
      paymentMethod: "Ví BSS",
      reference: "BSS202412211432",
    },
    {
      id: "2",
      type: "topup",
      amount: 100000,
      description: "Nạp tiền vào ví BSS",
      timestamp: "2024-12-20 09:15:30",
      status: "completed",
      paymentMethod: "Thẻ Visa *1234",
      reference: "TOP202412200915",
    },
    {
      id: "3",
      type: "swap",
      amount: -15000,
      description: "Đổi pin tại Big C Thăng Long",
      timestamp: "2024-12-19 16:45:22",
      status: "completed",
      paymentMethod: "Ví BSS",
      reference: "BSS202412191645",
    },
    {
      id: "4",
      type: "subscription",
      amount: -99000,
      description: "Gói VIP tháng 12/2024",
      timestamp: "2024-12-01 00:00:00",
      status: "completed",
      paymentMethod: "MoMo",
      reference: "SUB202412010000",
    },
    {
      id: "5",
      type: "refund",
      amount: 15000,
      description: "Hoàn tiền - Đổi pin thất bại",
      timestamp: "2024-11-28 11:30:45",
      status: "completed",
      paymentMethod: "Ví BSS",
      reference: "REF202411281130",
    },
    {
      id: "6",
      type: "topup",
      amount: 200000,
      description: "Nạp tiền vào ví BSS",
      timestamp: "2024-11-25 14:20:10",
      status: "failed",
      paymentMethod: "Vietcombank *5678",
      reference: "TOP202411251420",
    },
  ];

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "topup", label: "Nạp tiền" },
    { id: "swap", label: "Đổi pin" },
    { id: "subscription", label: "Đăng ký" },
    { id: "refund", label: "Hoàn tiền" },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return absAmount.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hôm nay ${date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Hôm qua ${date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topup":
        return "💰";
      case "swap":
        return "🔋";
      case "subscription":
        return "⭐";
      case "refund":
        return "↩️";
      default:
        return "💳";
    }
  };

  const getTypeColor = (type: string, amount: number) => {
    if (amount > 0) {
      return theme.colors.success;
    }
    switch (type) {
      case "swap":
        return theme.colors.primary;
      case "subscription":
        return theme.colors.accent;
      default:
        return theme.colors.error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const renderPaymentItem = ({ item }: { item: PaymentRecord }) => (
    <TouchableOpacity style={styles.paymentItem}>
      <View style={styles.paymentIcon}>
        <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        {item.paymentMethod && (
          <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        )}
        {item.reference && (
          <Text style={styles.reference}>Ref: {item.reference}</Text>
        )}
      </View>

      <View style={styles.paymentAmount}>
        <Text
          style={[
            styles.amount,
            {
              color: getTypeColor(item.type, item.amount),
            },
          ]}
        >
          {item.amount > 0 ? "+" : ""}
          {formatCurrency(item.amount)}
        </Text>
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
    </TouchableOpacity>
  );

  const filteredHistory =
    selectedFilter === "all"
      ? mockPaymentHistory
      : mockPaymentHistory.filter((item) => item.type === selectedFilter);

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
        <Text style={styles.headerTitle}>Lịch sử thanh toán</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === item.id && styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>6</Text>
          <Text style={styles.summaryLabel}>Giao dịch</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>285.000 VND</Text>
          <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>315.000 VND</Text>
          <Text style={styles.summaryLabel}>Tổng nạp</Text>
        </View>
      </View>

      {/* Payment History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có giao dịch nào</Text>
          </View>
        }
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
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.elevated,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  summaryContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.elevated,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  paymentItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.pressed,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },
  reference: {
    fontSize: 10,
    color: theme.colors.text.tertiary,
    fontFamily: "monospace",
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
