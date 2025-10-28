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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { subscriptionService, SubscriptionPackage } from "../../../services/api/SubscriptionService";
import { orderService } from "../../../services/api/OrderService";
import { useNotification } from "../../../contexts/NotificationContext";

type Props = NativeStackScreenProps<RootStackParamList, "BuyPackage">;

// Helper function to determine if a package is popular based on quota_swaps
const isPopularPackage = (quotaSwaps: number): boolean => {
  return quotaSwaps >= 30; // Consider packages with 30+ swaps as popular
};

export default function BuyPackageScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { showNotification } = useNotification();
  
  const selected = packages.find((p) => p.id === selectedId) || null;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionService.getSubscriptionPackages({
        page: 1,
        limit: 20,
        sortBy: "price",
        sortOrder: "asc",
      });
      
      if (response.success && response.data) {
        setPackages(response.data.data);
      } else {
        setError(response.error?.message || "Failed to load packages");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatVnd = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
    return numAmount.toLocaleString(i18n.language.startsWith("vi") ? "vi-VN" : "en-US") +
      (i18n.language.startsWith("vi") ? "đ" : "₫");
  };

  const handleConfirm = async () => {
    if (!selected) {
      showNotification({
        type: "warning",
        title: t("buyPackage.alert.noSelection.title"),
        message: t("buyPackage.alert.noSelection.message"),
        duration: 3000,
      });
      return;
    }

    try {
      setCreatingOrder(true);
      
      // Create order for package
      const orderResponse = await orderService.createOrder({
        type: "package",
        package_id: selected.id,
      });

      if (orderResponse.success && orderResponse.data) {
        // Navigate to order details screen with the created order data
        navigation.navigate("OrderDetails", {
          order: orderResponse.data,
        });
      } else {
        showNotification({
          type: "error",
          title: t("buyPackage.alert.orderFailed.title"),
          message: orderResponse.error?.message || t("buyPackage.alert.orderFailed.message"),
          duration: 4000,
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: t("buyPackage.alert.orderFailed.title"),
        message: t("buyPackage.alert.orderFailed.message"),
        duration: 4000,
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>{t("buyPackage.loading")}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPackages}>
            <Text style={styles.retryButtonText}>{t("buyPackage.retry")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (packages.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="package-variant" size={48} color="#ccc" />
          <Text style={styles.emptyText}>{t("buyPackage.noPackages")}</Text>
        </View>
      );
    }

    return packages.map((pkg) => {
      const active = selectedId === pkg.id;
      const isPopular = isPopularPackage(pkg.quota_swaps);
      
      return (
        <TouchableOpacity
          key={pkg.id}
          style={[styles.card, active && styles.cardActive]}
          onPress={() => setSelectedId(pkg.id)}
        >
          {isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>
                {t("buyPackage.popular")}
              </Text>
            </View>
          )}
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardIcon, active && styles.cardIconActive]}
            >
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={20}
                color={active ? "#ffffff" : "#5D7B6F"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{pkg.name}</Text>
              <Text style={styles.cardSubtitle}>
                {pkg.duration_days} {t("buyPackage.days")} •{" "}
                {pkg.quota_swaps} {t("buyPackage.swaps")}
              </Text>
            </View>
            <Text
              style={[
                styles.cardPrice,
                active && styles.cardPriceActive,
                isPopular && styles.cardPriceBump,
              ]}
            >
              {formatVnd(pkg.price)}
            </Text>
          </View>
          <Text style={styles.cardDesc}>{pkg.description}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
      >
        <Text style={styles.headerTitle}>{t("buyPackage.title")}</Text>
        {renderContent()}
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t("buyPackage.total")}</Text>
          <Text style={styles.summaryValue}>
            {selected ? formatVnd(selected.price) : "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, (!selected || creatingOrder) && styles.payBtnDisabled]}
          disabled={!selected || creatingOrder}
          onPress={handleConfirm}
        >
          {creatingOrder ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color="#ffffff"
            />
          )}
          <Text style={styles.payBtnText}>
            {creatingOrder ? t("buyPackage.creating") : t("buyPackage.pay")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8f9" },
  content: { flex: 1, padding: 16 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  cardActive: { borderColor: "#5D7B6F", shadowOpacity: 0.1 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F20",
  },
  cardIconActive: { backgroundColor: "#5D7B6F" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  cardSubtitle: { fontSize: 12, color: "#666" },
  cardPrice: { fontWeight: "700", color: "#111", marginTop: 20 },
  cardPriceBump: { alignSelf: "flex-start", marginTop: 20 },
  cardPriceActive: { color: "#5D7B6F" },
  cardDesc: { marginTop: 8, color: "#333" },
  popularBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: { color: "#2E7D32", fontSize: 10, fontWeight: "700" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { color: "#666" },
  summaryValue: { color: "#111", fontWeight: "700" },
  payBtn: {
    backgroundColor: "#5D7B6F",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { color: "#fff", fontWeight: "700" },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
