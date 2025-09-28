import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

interface SwapHistoryItem {
  id: string;
  date: string;
  time: string;
  station: string;
  batteryFrom: string;
  batteryTo: string;
  cost: number;
  status: "completed" | "cancelled" | "pending";
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  time: string;
  type: "swap" | "subscription" | "deposit";
  description: string;
  amount: number;
  status: "completed" | "failed" | "pending";
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"swap" | "payment">("swap");

  const swapHistory: SwapHistoryItem[] = [
    {
      id: "1",
      date: "27/09/2025",
      time: "14:30",
      station: "Trạm Cầu Giấy - A1",
      batteryFrom: "Pin 75%",
      batteryTo: "Pin 100%",
      cost: 15000,
      status: "completed",
    },
    {
      id: "2",
      date: "26/09/2025",
      time: "09:15",
      station: "Trạm Hoàn Kiếm - B2",
      batteryFrom: "Pin 25%",
      batteryTo: "Pin 95%",
      cost: 20000,
      status: "completed",
    },
    {
      id: "3",
      date: "25/09/2025",
      time: "18:45",
      station: "Trạm Thanh Xuân - C3",
      batteryFrom: "Pin 30%",
      batteryTo: "Pin 100%",
      cost: 18000,
      status: "completed",
    },
  ];

  const paymentHistory: PaymentHistoryItem[] = [
    {
      id: "1",
      date: "27/09/2025",
      time: "14:30",
      type: "swap",
      description: "Đổi pin tại Trạm Cầu Giấy - A1",
      amount: 15000,
      status: "completed",
    },
    {
      id: "2",
      date: "26/09/2025",
      time: "09:15",
      type: "swap",
      description: "Đổi pin tại Trạm Hoàn Kiếm - B2",
      amount: 20000,
      status: "completed",
    },
    {
      id: "3",
      date: "25/09/2025",
      time: "00:00",
      type: "subscription",
      description: "Gói đăng ký hàng tháng",
      amount: 500000,
      status: "completed",
    },
    {
      id: "4",
      date: "24/09/2025",
      time: "18:45",
      type: "swap",
      description: "Đổi pin tại Trạm Thanh Xuân - C3",
      amount: 18000,
      status: "completed",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#22c55e";
      case "pending":
        return "#f59e0b";
      case "failed":
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const renderSwapItem = ({ item }: { item: SwapHistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.stationName}>{item.station}</Text>
          <Text style={styles.dateTime}>
            {item.date} • {item.time}
          </Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.cost}>{formatCurrency(item.cost)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.batteryInfo}>
        <View style={styles.batteryChange}>
          <Text style={styles.batteryFrom}>🔋 {item.batteryFrom}</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.batteryTo}>🔋 {item.batteryTo}</Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentItem = ({ item }: { item: PaymentHistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.paymentDescription}>{item.description}</Text>
          <Text style={styles.dateTime}>
            {item.date} • {item.time}
          </Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.cost}>{formatCurrency(item.amount)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.paymentType}>
        <Text style={styles.typeText}>
          {item.type === "swap"
            ? "💡 Đổi pin"
            : item.type === "subscription"
            ? "📋 Đăng ký"
            : "💰 Nạp tiền"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử</Text>
      </View>

      {/* Tab Container */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "swap" && styles.activeTab]}
          onPress={() => setActiveTab("swap")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "swap" && styles.activeTabText,
            ]}
          >
            🔋 Đổi pin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "payment" && styles.activeTab]}
          onPress={() => setActiveTab("payment")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "payment" && styles.activeTabText,
            ]}
          >
            💳 Thanh toán
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "swap" ? (
          <FlatList
            data={swapHistory}
            renderItem={renderSwapItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={paymentHistory}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#5D7B6F",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888888",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 12,
    color: "#888888",
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D7B6F",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#ffffff",
  },
  batteryInfo: {
    marginTop: 8,
  },
  batteryChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  batteryFrom: {
    fontSize: 14,
    color: "#f59e0b",
  },
  arrow: {
    fontSize: 16,
    color: "#888888",
  },
  batteryTo: {
    fontSize: 14,
    color: "#22c55e",
  },
  paymentType: {
    marginTop: 8,
  },
  typeText: {
    fontSize: 12,
    color: "#888888",
  },
});
