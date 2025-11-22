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
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { orderService, Order } from "../../../services/api/OrderService";
import { swapCreditsService } from "../../../services/api/SwapCreditsService";
import { useNotification } from "../../../contexts/NotificationContext";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderDetailsScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { order: orderData, shouldRefresh } = route.params;
  const [order, setOrder] = useState<Order | null>(orderData || null);
  const [isPolling, setIsPolling] = useState(false);
  const { showNotification } = useNotification();

  // Reload swap credits when returning from payment success
  useEffect(() => {
    if (shouldRefresh) {
      console.log(
        "🔄 [OrderDetails] Refreshing swap credits after payment success"
      );
      swapCreditsService
        .getMySwapCredits()
        .then((response) => {
          if (response.success) {
            console.log(
              "✅ [OrderDetails] Swap credits refreshed:",
              response.data
            );
            showNotification({
              type: "success",
              title: i18n.language.startsWith("vi") ? "Đã cập nhật" : "Updated",
              message: i18n.language.startsWith("vi")
                ? "Số dư lượt đổi đã được cập nhật"
                : "Swap credits balance updated",
              duration: 2000,
            });
          }
        })
        .catch((error) => {
          console.error(
            "❌ [OrderDetails] Error refreshing swap credits:",
            error
          );
        });
    }
  }, [shouldRefresh, i18n.language, showNotification]);

  // Polling effect to check order status every 5 seconds
  useEffect(() => {
    if (!order || order.status !== "pending") {
      console.log("🛑 Polling stopped - Order not pending:", order?.status);
      return;
    }

    console.log(
      "🔄 Starting polling for order:",
      order.id,
      "Status:",
      order.status
    );
    setIsPolling(true);

    const interval = setInterval(async () => {
      try {
        console.log("⏰ Polling order status...");
        const response = await orderService.getOrder(order.id);
        console.log("📡 Polling response:", response);

        if (response.success && response.data) {
          console.log("✅ Order status received:", response.data.status);

          // Only update status, keep other order data unchanged
          setOrder((prevOrder) => {
            if (prevOrder) {
              return {
                ...prevOrder,
                status: response.data.status,
              };
            }
            return prevOrder;
          });

          // Stop polling if order is no longer pending
          if (response.data.status !== "pending") {
            console.log(
              "🛑 Stopping polling - Status changed to:",
              response.data.status
            );
            setIsPolling(false);
            clearInterval(interval);

            // Show success message if paid or success
            if (
              response.data.status === "paid" ||
              response.data.status === "success"
            ) {
              console.log("🎉 Payment successful!");
              navigation.navigate("PaymentSuccess", { order: response.data });
            }
          }
        } else {
          console.log("❌ Polling failed:", response.error);
        }
      } catch (error) {
        console.error("💥 Error polling order status:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      console.log("🧹 Cleaning up polling interval");
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [order?.id, order?.status, t]);

  const formatVnd = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
    return (
      numAmount.toLocaleString(
        i18n.language.startsWith("vi") ? "vi-VN" : "en-US"
      ) + (i18n.language.startsWith("vi") ? "đ" : "₫")
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    // In a real app, you would use Clipboard from expo-clipboard
    showNotification({
      type: "success",
      title: t("order.copied"),
      message: `${label} ${t("order.copiedToClipboard")}`,
      duration: 2000,
    });
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={48}
            color="#ff6b6b"
          />
          <Text style={styles.errorText}>{t("order.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.headerTitle}>
          {i18n.language.startsWith("vi")
            ? "Thanh toán chuyển khoản"
            : "Bank Transfer Payment"}
        </Text>

        {/* Order Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              {i18n.language.startsWith("vi")
                ? "Trạng thái đơn hàng"
                : "Order Status"}
            </Text>
            <View style={styles.statusValue}>
              <Text
                style={[
                  styles.statusText,
                  order.status === "paid" && styles.statusPaid,
                  order.status === "pending" && styles.statusPending,
                  order.status === "cancelled" && styles.statusCancelled,
                  order.status === "expired" && styles.statusExpired,
                ]}
              >
                {order.status.toUpperCase()}
              </Text>
              {isPolling && order.status === "pending" && (
                <ActivityIndicator
                  size="small"
                  color="#5D7B6F"
                  style={styles.pollingIndicator}
                />
              )}
            </View>
          </View>
        </View>

        {/* Account information */}
        <View style={styles.accountInfoBox}>
          <Text style={styles.accountInfoTitle}>
            {i18n.language.startsWith("vi")
              ? "Nhập thông tin tài khoản được cung cấp"
              : "Enter the provided account information"}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {i18n.language.startsWith("vi")
                ? "Ngân hàng thụ hưởng"
                : "Beneficiary Bank"}
            </Text>
            <View style={styles.infoValue}>
              <Text style={styles.bankName}>
                {order.payment_info?.bank_id === "970422"
                  ? "VPBank"
                  : `Bank ${order.payment_info?.bank_id || "N/A"}`}
              </Text>
              <View style={styles.bankLogoSmall} />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {i18n.language.startsWith("vi")
                ? "Số tài khoản"
                : "Account Number"}
            </Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>
                {order.payment_info?.account_no || "N/A"}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    order.payment_info?.account_no || "",
                    "Account Number"
                  )
                }
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#5D7B6F"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {i18n.language.startsWith("vi") ? "Số tiền" : "Amount"}
            </Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>
                {formatVnd(order.total_amount)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(order.total_amount.toString(), "Amount")
                }
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#5D7B6F"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {i18n.language.startsWith("vi") ? "Họ và tên" : "Full Name"}
            </Text>
            <Text style={styles.infoText}>
              {order.payment_info?.account_name ||
                order.user?.name ||
                (i18n.language.startsWith("vi")
                  ? "Công Ty CP CN Sen Đỏ"
                  : "Sen Do Technology Company")}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {i18n.language.startsWith("vi")
                ? "Nội dung chuyển khoản"
                : "Transfer Content"}
            </Text>
            <Text style={styles.infoText}>
              {order.payment_info?.description ||
                order.payment?.content ||
                (i18n.language.startsWith("vi")
                  ? "Thanh toán đơn hàng"
                  : "Order payment")}
            </Text>
          </View>

          {/* Package information */}
          {order.package && (
            <View style={styles.packageSection}>
              <Text style={styles.packageTitle}>
                {i18n.language.startsWith("vi")
                  ? "Thông tin gói đã chọn"
                  : "Selected Package"}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Tên gói" : "Package Name"}
                </Text>
                <Text style={styles.infoText}>{order.package.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Thời hạn" : "Duration"}
                </Text>
                <Text style={styles.infoText}>
                  {order.package.duration_days}{" "}
                  {i18n.language.startsWith("vi") ? "ngày" : "days"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Số lượt đổi" : "Swaps"}
                </Text>
                <Text style={styles.infoText}>
                  {order.package.quota_swaps}{" "}
                  {i18n.language.startsWith("vi") ? "lượt" : "swaps"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Mô tả" : "Description"}
                </Text>
                <Text style={styles.infoText}>{order.package.description}</Text>
              </View>
            </View>
          )}

          {/* Single swap information */}
          {order.type === "single" && (
            <View style={styles.packageSection}>
              <Text style={styles.packageTitle}>
                {i18n.language.startsWith("vi")
                  ? "Thông tin lượt đổi"
                  : "Swap Information"}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Loại" : "Type"}
                </Text>
                <Text style={styles.infoText}>
                  {i18n.language.startsWith("vi")
                    ? "Lượt đổi đơn"
                    : "Single Swaps"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Số lượng" : "Quantity"}
                </Text>
                <Text style={styles.infoText}>
                  {order.quantity}{" "}
                  {i18n.language.startsWith("vi") ? "lượt" : "swaps"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi")
                    ? "Giá mỗi lượt"
                    : "Price per swap"}
                </Text>
                <Text style={styles.infoText}>{formatVnd(25000)}</Text>
              </View>
            </View>
          )}

          {/* QR Code section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              {order.payment_info?.qr_code ? (
                <Image
                  source={{ uri: order.payment_info.qr_code }}
                  style={styles.qrCode}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.qrCode} />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8f9" },
  content: { flex: 1, padding: 16 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },
  statusContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    color: "#ff9500",
    backgroundColor: "#fff3e0",
  },
  statusPaid: {
    color: "#34c759",
    backgroundColor: "#e8f5e8",
  },
  statusCancelled: {
    color: "#ff3b30",
    backgroundColor: "#ffe6e6",
  },
  statusExpired: {
    color: "#8e8e93",
    backgroundColor: "#f2f2f7",
  },
  pollingIndicator: {
    marginLeft: 4,
  },
  timeLimitBanner: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  timeLimitText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  countdownText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  bankLogos: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bankLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  moreBanks: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  moreBanksText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  accountInfoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#5D7B6F",
    marginBottom: 20,
  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  infoTextOptional: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  orderDetailsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  orderDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  packageSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  bankName: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  bankLogoSmall: {
    width: 20,
    height: 20,
    backgroundColor: "#ff6b6b",
    borderRadius: 4,
  },
  qrSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  qrCode: {
    width: 250,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
});
