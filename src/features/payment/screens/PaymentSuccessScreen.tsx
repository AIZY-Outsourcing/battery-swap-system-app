import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Order } from "../../../services/api/OrderService";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentSuccess">;

export default function PaymentSuccessScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { order } = route.params;

  const formatVnd = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
    return numAmount.toLocaleString(i18n.language.startsWith("vi") ? "vi-VN" : "en-US") +
      (i18n.language.startsWith("vi") ? "đ" : "₫");
  };

  const handleGoHome = () => {
    navigation.navigate("Home");
  };

  const handleViewOrder = () => {
    navigation.navigate("OrderDetails", { order });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons name="check-circle" size={80} color="#34c759" />
          </View>
          <Text style={styles.successTitle}>
            {i18n.language.startsWith("vi") ? "Thanh toán thành công!" : "Payment Successful!"}
          </Text>
          <Text style={styles.successSubtitle}>
            {i18n.language.startsWith("vi") 
              ? "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi" 
              : "Thank you for using our service"}
          </Text>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>
            {i18n.language.startsWith("vi") ? "Tóm tắt đơn hàng" : "Order Summary"}
          </Text>

          {/* Order Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {i18n.language.startsWith("vi") ? "Mã đơn hàng" : "Order ID"}
              </Text>
              <Text style={styles.infoText}>{order.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {i18n.language.startsWith("vi") ? "Trạng thái" : "Status"}
              </Text>
              <Text style={[styles.infoText, styles.statusPaid]}>
                {order.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {i18n.language.startsWith("vi") ? "Tổng thanh toán" : "Total Amount"}
              </Text>
              <Text style={[styles.infoText, styles.amountText]}>
                {formatVnd(order.total_amount)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {i18n.language.startsWith("vi") ? "Thời gian" : "Payment Time"}
              </Text>
              <Text style={styles.infoText}>
                {new Date(order.updated_at).toLocaleString(
                  i18n.language.startsWith("vi") ? "vi-VN" : "en-US"
                )}
              </Text>
            </View>
          </View>

          {/* Package/Swap Info */}
          {order.package && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>
                {i18n.language.startsWith("vi") ? "Thông tin gói" : "Package Information"}
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
                  {order.package.duration_days} {i18n.language.startsWith("vi") ? "ngày" : "days"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Số lượt đổi" : "Swaps"}
                </Text>
                <Text style={styles.infoText}>
                  {order.package.quota_swaps} {i18n.language.startsWith("vi") ? "lượt" : "swaps"}
                </Text>
              </View>
            </View>
          )}

          {order.type === "single" && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>
                {i18n.language.startsWith("vi") ? "Thông tin lượt đổi" : "Swap Information"}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Loại" : "Type"}
                </Text>
                <Text style={styles.infoText}>
                  {i18n.language.startsWith("vi") ? "Lượt đổi đơn" : "Single Swaps"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {i18n.language.startsWith("vi") ? "Số lượng" : "Quantity"}
                </Text>
                <Text style={styles.infoText}>
                  {order.quantity} {i18n.language.startsWith("vi") ? "lượt" : "swaps"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>
            {i18n.language.startsWith("vi") ? "Bước tiếp theo" : "Next Steps"}
          </Text>
          
          <View style={styles.stepItem}>
            <MaterialCommunityIcons name="battery" size={20} color="#5D7B6F" />
            <Text style={styles.stepText}>
              {i18n.language.startsWith("vi") 
                ? "Bạn có thể sử dụng lượt đổi ngay bây giờ" 
                : "You can use your swaps right now"}
            </Text>
          </View>

          <View style={styles.stepItem}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#5D7B6F" />
            <Text style={styles.stepText}>
              {i18n.language.startsWith("vi") 
                ? "Tìm trạm đổi pin gần nhất để sử dụng" 
                : "Find the nearest battery swap station to use"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionContainer, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewOrder}>
          <MaterialCommunityIcons name="receipt" size={20} color="#5D7B6F" />
          <Text style={styles.secondaryButtonText}>
            {i18n.language.startsWith("vi") ? "Xem chi tiết" : "View Details"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <MaterialCommunityIcons name="home" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>
            {i18n.language.startsWith("vi") ? "Về trang chủ" : "Go Home"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8f9",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  successHeader: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34c759",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
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
  infoText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  statusPaid: {
    color: "#34c759",
    fontWeight: "600",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  nextStepsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  stepText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#5D7B6F",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#5D7B6F",
  },
  secondaryButtonText: {
    color: "#5D7B6F",
    fontWeight: "600",
    fontSize: 16,
  },
});
