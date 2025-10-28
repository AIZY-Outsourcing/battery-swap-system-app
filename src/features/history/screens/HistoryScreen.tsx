import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  mockSwapHistory,
  mockSubscriptions,
  type SwapTransaction,
  type Subscription,
} from "../../../data/mockData";
import { styleTokens } from "../../../styles/tokens";
import { orderService, type Order } from "../../../services/api/OrderService";

type TabKey = "swap" | "payment" | "subscription";

export default function HistoryScreen() {
  const [tab, setTab] = useState<TabKey>("swap");
  const { t } = useTranslation();
  
  // Order API state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshingOrders(true);
    } else {
      setLoadingOrders(true);
    }
    setOrderError(null);

    try {
      const response = await orderService.getOrderHistory({
        page: 1,
        limit: 50,
        sortBy: "created_at",
        sortOrder: "desc",
        status: "success",
      });

      if (response.success && response.data) {
        setOrders(response.data.data);
      } else {
        setOrderError(response.error?.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      setOrderError(error.message || "Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
      setRefreshingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Derive & sort data (newest first)
  const swapData = useMemo(
    () =>
      [...mockSwapHistory].sort(
        (a, b) => b.swapDate.getTime() - a.swapDate.getTime()
      ),
    []
  );
  const paymentData = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [orders]
  );
  const subscriptionData = useMemo(
    () =>
      [...mockSubscriptions].sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime()
      ),
    []
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success": // payment success
      case "active":
        return "#22c55e";
      case "pending":
        return "#f59e0b";
      case "failed":
      case "cancelled":
      case "expired":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return t("status.completed");
      case "pending":
        return t("status.pending");
      case "failed":
        return t("status.failed");
      case "cancelled":
        return t("status.cancelled");
      case "active":
        return t("status.inEffect");
      case "expired":
        return t("status.expired");
      default:
        return status;
    }
  };

  const renderSwap = ({ item }: { item: SwapTransaction }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.title}>{item.stationName}</Text>
            <Text style={styles.subTime}>
              {item.swapDate.toLocaleDateString("vi-VN")} •{" "}
              {item.swapDate.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View style={styles.rightAlign}>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusColor(item.status) },
              ]}
            >
              <Text style={styles.badgeText}>{statusText(item.status)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.swapBatteriesRow}>
          <View style={styles.iconWithText}>
            <MaterialCommunityIcons
              name="battery-outline"
              size={18}
              color="#374151"
            />
            <Text style={styles.batteryText}>
              {item.oldBatteryId || t("history.oldBattery")}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color="#9ca3af"
            style={styles.arrowIcon}
          />
          <View style={styles.iconWithText}>
            <MaterialCommunityIcons
              name="battery-high"
              size={18}
              color="#16a34a"
            />
            <Text style={styles.batteryText}>
              {item.newBatteryId || t("history.newBattery")}
            </Text>
          </View>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>{t("history.batteryType")}:</Text>
          <Text style={styles.metaValue}>{item.batteryType}</Text>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>
            {t("history.paymentMethodLabel", {
              defaultValue: t("history.methodLabel"),
            })}
            :
          </Text>
          <Text style={styles.metaValue}>
            {item.paymentMethod === "subscription"
              ? t("history.paymentMethodSubscription")
              : t("history.paymentMethodPayPerSwap")}
          </Text>
        </View>
      </View>
    );
  };

  const renderPayment = ({ item }: { item: Order }) => {
    const orderDate = new Date(item.created_at);
    const amount = parseInt(item.total_amount.toString());
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.title}>
              {item.type === "package" 
                ? `Gói ${item.package?.name || "Package"}` 
                : `${item.quantity} lượt đổi`}
            </Text>
            <Text style={styles.subTime}>
              {orderDate.toLocaleDateString("vi-VN")} •{" "}
              {orderDate.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.amount}>{formatCurrency(amount)}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusColor(item.status) },
              ]}
            >
              <Text style={styles.badgeText}>{statusText(item.status)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>{t("history.typeLabel")}:</Text>
          <Text style={styles.metaValue}>
            {item.type === "package"
              ? t("history.subscriptionTab")
              : item.type === "single"
              ? t("history.swapTab")
              : item.type}
          </Text>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>{t("history.methodLabel")}:</Text>
          <Text style={styles.metaValue}>Bank Transfer</Text>
        </View>
        {item.package && (
          <View style={styles.inlineMeta}>
            <Text style={styles.metaLabel}>Package:</Text>
            <Text style={styles.metaValue}>{item.package.name}</Text>
          </View>
        )}
        {item.type === "single" && (
          <View style={styles.inlineMeta}>
            <Text style={styles.metaLabel}>Quantity:</Text>
            <Text style={styles.metaValue}>{item.quantity} swaps</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSubscription = ({ item }: { item: Subscription }) => {
    const period = `${item.startDate.toLocaleDateString(
      "vi-VN"
    )} → ${item.endDate.toLocaleDateString("vi-VN")}`;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subTime}>{period}</Text>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.amount}>{formatCurrency(item.price)}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusColor(item.status) },
              ]}
            >
              <Text style={styles.badgeText}>{statusText(item.status)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>{t("history.typeLabel")}:</Text>
          <Text style={styles.metaValue}>
            {item.type === "unlimited"
              ? t("history.unlimited")
              : `${item.swapLimit} ${t("history.timesSuffix")}`}
          </Text>
        </View>
        <View style={styles.inlineMeta}>
          <Text style={styles.metaLabel}>{t("history.durationLabel")}:</Text>
          <Text style={styles.metaValue}>
            {item.duration} {t("history.daysSuffix")}
          </Text>
        </View>
        {item.remainingSwaps !== undefined && (
          <View style={styles.inlineMeta}>
            <Text style={styles.metaLabel}>{t("history.remainingLabel")}:</Text>
            <Text style={styles.metaValue}>{item.remainingSwaps}</Text>
          </View>
        )}
      </View>
    );
  };

  const tabDataMap: Record<TabKey, any[]> = {
    swap: swapData,
    payment: paymentData,
    subscription: subscriptionData,
  };
  const renderMap: Record<TabKey, any> = {
    swap: renderSwap,
    payment: renderPayment,
    subscription: renderSubscription,
  };

  const currentData = tabDataMap[tab];
  const renderer = renderMap[tab];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("history.title")}</Text>
      </View>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            tab === "swap" ? styles.tabActive : styles.tabInactive,
          ]}
          onPress={() => setTab("swap")}
        >
          <Text
            style={[styles.tabText, tab === "swap" && styles.tabTextActive]}
          >
            {t("history.swapTab", { defaultValue: "Đổi pin" })} (
            {swapData.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            tab === "payment" ? styles.tabActive : styles.tabInactive,
          ]}
          onPress={() => setTab("payment")}
        >
          <Text
            style={[styles.tabText, tab === "payment" && styles.tabTextActive]}
          >
            {t("history.paymentTab", { defaultValue: "Thanh toán" })} (
            {paymentData.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            tab === "subscription" ? styles.tabActive : styles.tabInactive,
          ]}
          onPress={() => setTab("subscription")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "subscription" && styles.tabTextActive,
            ]}
          >
            {t("history.subscriptionTab", { defaultValue: "Gói" })} (
            {subscriptionData.length})
          </Text>
        </TouchableOpacity>
      </View>
      {tab === "payment" && loadingOrders ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : tab === "payment" && orderError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{orderError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : currentData.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>{t("history.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("history.emptySubtitle")}</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item: any) => item.id}
          renderItem={renderer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            tab === "payment" ? (
              <RefreshControl
                refreshing={refreshingOrders}
                onRefresh={() => fetchOrders(true)}
                colors={["#5D7B6F"]}
              />
            ) : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: styleTokens.spacing.lg,
  },
  header: {
    paddingVertical: styleTokens.spacing.lg,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: styleTokens.radius + 4,
    padding: 4,
    marginBottom: styleTokens.spacing.lg,
    borderWidth: 1,
    borderColor: "#d8e1e8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: styleTokens.radius,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#5D7B6F",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: styleTokens.radius,
    padding: styleTokens.spacing.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: styleTokens.spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    marginBottom: styleTokens.spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  subTime: {
    fontSize: 12,
    color: "#64748b",
  },
  rightAlign: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: styleTokens.colors.primary,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  swapBatteriesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: styleTokens.spacing.sm,
    gap: 6,
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  batteryText: {
    fontSize: 13,
    color: "#374151",
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  inlineMeta: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: "#6b7280",
    width: 90,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: styleTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: styleTokens.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: styleTokens.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
