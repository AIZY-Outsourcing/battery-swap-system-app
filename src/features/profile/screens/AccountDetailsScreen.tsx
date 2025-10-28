import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../../store/authStore";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { swapCreditsService, type SwapCredits, type ActiveSubscriptionPackage } from "../../../services/api/SwapCreditsService";

type Props = NativeStackScreenProps<AppStackParamList, "AccountDetails">;

export default function AccountDetailsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const storeCredits = useAuthStore((s) => s.user?.swapCredits);
  
  // Swap credits API state
  const [swapCredits, setSwapCredits] = useState<SwapCredits | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch swap credits
  const fetchSwapCredits = async () => {
    setLoadingCredits(true);
    setCreditsError(null);

    try {
      const response = await swapCreditsService.getMySwapCredits();
      
      if (response.success && response.data) {
        setSwapCredits(response.data);
      } else {
        setCreditsError(response.error?.message || "Failed to fetch credits");
      }
    } catch (error: any) {
      setCreditsError(error.message || "Failed to fetch credits");
    } finally {
      setLoadingCredits(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSwapCredits();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSwapCredits();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Format VND currency
  const formatVnd = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
    return numAmount.toLocaleString('vi-VN') + 'đ';
  };
  const accountData = {
    singleSwaps: {
      count: 5,
      history: [
        {
          id: 1,
          stationName: "Trạm Cầu Giấy",
          date: "2024-09-28 14:30",
          batteryFrom: "45%",
          batteryTo: "98%",
          cost: "25,000đ",
        },
        {
          id: 2,
          stationName: "Trạm Đống Đa",
          date: "2024-09-27 09:15",
          batteryFrom: "23%",
          batteryTo: "95%",
          cost: "25,000đ",
        },
      ],
    },
    packageSwaps: {
      reserved: "20Tr",
      history: [
        {
          id: 1,
          packageName: "Gói Premium",
          purchaseDate: "2024-09-20",
          validUntil: "2024-10-20",
          swapsLeft: 20,
          totalSwaps: 30,
        },
      ],
    },
    wallet: {
      balance: "339đ",
      recentTransactions: [
        {
          id: 1,
          type: "Nạp tiền",
          amount: "+500,000đ",
          date: "2024-09-25",
          method: "MoMo",
        },
        {
          id: 2,
          type: "Đổi pin",
          amount: "-25,000đ",
          date: "2024-09-24",
          station: "Trạm Cầu Giấy",
        },
      ],
    },
  };

  // Remaining single swap credits: prefer store value, fallback to mock count (5)
  const credits = storeCredits ?? accountData.singleSwaps.count;

  const renderSectionHeader = (
    title: string,
    count?: string,
    iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  ) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        {iconName ? (
          <MaterialCommunityIcons name={iconName} size={18} color="#5D7B6F" />
        ) : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {count && <Text style={styles.sectionCount}>{count}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header removed: using native header from stack */}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5D7B6F"]}
            tintColor="#5D7B6F"
          />
        }
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrap}>
                <MaterialCommunityIcons
                  name="battery"
                  size={16}
                  color="#ffffff"
                />
              </View>
              <Text style={styles.summaryLabel}>{t("credits.single")}</Text>
              <Text style={styles.summaryValue}>
                {loadingCredits ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : creditsError ? (
                  "—"
                ) : (
                  swapCredits?.remaining_credits || 0
                )}
              </Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrap}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={16}
                  color="#ffffff"
                />
              </View>
              <Text style={styles.summaryLabel}>{t("credits.package")}</Text>
              <Text style={styles.summaryValue}>
                {loadingCredits ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : creditsError ? (
                  "—"
                ) : (
                  swapCredits?.total_remaining_quota_swaps || 0
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Lượt đổi lẻ */}
        <View style={styles.section}>
          {renderSectionHeader(
            t("credits.singleSection"),
            loadingCredits ? "..." : creditsError ? "—" : `${swapCredits?.remaining_credits || 0}`,
            "battery"
          )}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryBoxLabel}>
                {t("credits.remaining")}
              </Text>
              <Text style={styles.summaryBoxValue}>
                {loadingCredits ? (
                  <ActivityIndicator size="small" color="#5D7B6F" />
                ) : creditsError ? (
                  "—"
                ) : (
                  swapCredits?.remaining_credits || 0
                )}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryBoxLabel}>
                {t("credits.usedThisMonth")}
              </Text>
              <Text style={styles.summaryBoxValue}>
                {loadingCredits ? (
                  <ActivityIndicator size="small" color="#5D7B6F" />
                ) : creditsError ? (
                  "—"
                ) : (
                  swapCredits?.used_credits || 0
                )}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryBoxLabel}>
                {t("credits.lastTime")}
              </Text>
              <Text style={styles.summaryBoxValue}>
                {loadingCredits ? (
                  <ActivityIndicator size="small" color="#5D7B6F" />
                ) : creditsError ? (
                  "—"
                ) : swapCredits?.latest_swap_credit?.created_at ? (
                  formatDate(swapCredits.latest_swap_credit.created_at)
                ) : (
                  "—"
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Lượt đổi gói */}
        <View style={styles.section}>
          {renderSectionHeader(
            t("credits.packageSection"),
            loadingCredits ? "..." : creditsError ? "—" : `${swapCredits?.total_remaining_quota_swaps || 0}`,
            "package-variant-closed"
          )}
          {loadingCredits ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D7B6F" />
              <Text style={styles.loadingText}>Đang tải thông tin gói...</Text>
            </View>
          ) : creditsError ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={48} color="#ff6b6b" />
              <Text style={styles.errorText}>Không thể tải thông tin gói</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchSwapCredits}>
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : swapCredits?.active_subscription_packages && swapCredits.active_subscription_packages.length > 0 ? (
            swapCredits.active_subscription_packages.map((pkg: ActiveSubscriptionPackage) => (
              <View key={pkg.id} style={styles.packageItem}>
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageStatus}>{t("credits.active")}</Text>
                </View>
                <View style={styles.packageDetails}>
                  <Text style={styles.packageInfo}>
                    {t("credits.left")}: {pkg.remaining_quota_swaps}/{pkg.quota_swaps}
                  </Text>
                  <Text style={styles.packageExpiry}>
                    {t("credits.expires")}: {formatDate(pkg.end_date)}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(pkg.remaining_quota_swaps / pkg.quota_swaps) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="package-variant-closed" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có gói đăng ký nào</Text>
              <TouchableOpacity 
                style={styles.buyPackageButton}
                onPress={() => navigation.navigate("BuyPackage")}
              >
                <Text style={styles.buyPackageButtonText}>Mua gói ngay</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom spacing to avoid footer overlap (accounts for safe area) */}
        <View style={[styles.bottomSpacing, { height: 110 + insets.bottom }]} />
      </ScrollView>

      {/* Sticky footer actions */}
      <View style={[styles.footerActions, { bottom: insets.bottom }]}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionPrimary]}
            onPress={() => navigation.navigate("BuySwap")}
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={styles.actionButtonText}>
              {t("credits.buySingle")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionSecondary]}
            onPress={() => navigation.navigate("BuyPackage")}
          >
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={18}
              color="#5D7B6F"
            />
            <Text style={styles.actionButtonTextSecondary}>
              {t("credits.buyPackage")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  // pageGradient removed
  // header styles removed
  content: { flex: 1, padding: 16 },
  summaryCard: {
    backgroundColor: "#5d7b6f",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: { flex: 1, alignItems: "center", gap: 6 },
  summaryIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#5D7B6F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff50",
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: "#ffffff55",
    marginHorizontal: 8,
  },
  summaryLabel: { fontSize: 12, color: "#ffffff", opacity: 0.9 },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#ffffff" },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 0,
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#000000" },
  sectionCount: { fontSize: 16, fontWeight: "600", color: "#5D7B6F" },
  summaryGrid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryBoxLabel: { fontSize: 12, color: "#666666", marginBottom: 4 },
  summaryBoxValue: { fontSize: 16, fontWeight: "700", color: "#000000" },
  actionsRow: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  actionPrimary: { backgroundColor: "#5D7B6F" },
  actionSecondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#5D7B6F",
  },
  actionButtonText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
  actionButtonTextSecondary: {
    color: "#5D7B6F",
    fontWeight: "600",
    fontSize: 14,
  },
  packageItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#5D7B6F",
    borderWidth: 1,
    borderColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  packageName: { fontSize: 16, fontWeight: "500", color: "#000000" },
  packageStatus: {
    fontSize: 12,
    color: "#4CAF50",
    backgroundColor: "#4CAF5020",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  packageDetails: { gap: 8 },
  packageInfo: { fontSize: 14, color: "#5D7B6F", fontWeight: "500" },
  packageExpiry: { fontSize: 14, color: "#888888" },
  progressTrack: {
    height: 6,
    backgroundColor: "#eaeaea",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: "#5D7B6F", borderRadius: 4 },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#ff6b6b",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  buyPackageButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
  },
  buyPackageButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacing: { height: 110 },
  footerActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
});
