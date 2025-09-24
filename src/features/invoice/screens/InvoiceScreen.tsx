import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";

type InvoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "InvoiceScreen"
>;

const InvoiceScreen = () => {
  const route = useRoute<InvoiceScreenProps["route"]>();
  const navigation = useNavigation();
  const { paymentId } = route.params;

  // Mock invoice data
  const invoiceData = {
    id: paymentId,
    transactionId: "TXN" + paymentId.slice(-6),
    type: "swap_package",
    amount: 550000,
    packageName: "Gói Phổ biến - 10 lượt đổi",
    date: new Date(),
    paymentMethod: "MoMo Wallet",
    status: "completed",
    stationName: "Trạm BSS Cầu Giấy",
    batteryType: "Type A",
    swapTime: "2 phút 30 giây",
    customerInfo: {
      name: "Nguyễn Văn A",
      phone: "0987654321",
      vehiclePlate: "30A-12345",
    },
    breakdown: [{ item: "Gói 10 lượt đổi pin", quantity: 1, price: 550000 }],
    taxes: 0,
    total: 550000,
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Trở về</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hóa đơn</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>HÓA ĐƠN THANH TOÁN</Text>
          <Text style={styles.invoiceNumber}>#{invoiceData.transactionId}</Text>
          <Text style={styles.invoiceDate}>{formatDate(invoiceData.date)}</Text>
          <View style={[styles.statusBadge, styles.statusCompleted]}>
            <Text style={styles.statusText}>Thành công</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ tên:</Text>
            <Text style={styles.infoValue}>
              {invoiceData.customerInfo.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại:</Text>
            <Text style={styles.infoValue}>
              {invoiceData.customerInfo.phone}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biển số xe:</Text>
            <Text style={styles.infoValue}>
              {invoiceData.customerInfo.vehiclePlate}
            </Text>
          </View>
        </View>

        {/* Service Details */}
        {invoiceData.stationName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết dịch vụ</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạm:</Text>
              <Text style={styles.infoValue}>{invoiceData.stationName}</Text>
            </View>
            {invoiceData.batteryType && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại pin:</Text>
                <Text style={styles.infoValue}>{invoiceData.batteryType}</Text>
              </View>
            )}
            {invoiceData.swapTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian đổi:</Text>
                <Text style={styles.infoValue}>{invoiceData.swapTime}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          {invoiceData.breakdown.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          {invoiceData.taxes > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Thuế VAT:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(invoiceData.taxes)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Tổng cộng:</Text>
            <Text style={styles.grandTotalValue}>
              {formatPrice(invoiceData.total)}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phương thức:</Text>
            <Text style={styles.infoValue}>{invoiceData.paymentMethod}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={[styles.infoValue, styles.statusSuccess]}>
              Thành công
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cảm ơn bạn đã sử dụng dịch vụ BSS Battery Swap!
          </Text>
          <Text style={styles.footerSubText}>
            Mọi thắc mắc xin liên hệ: 1900-xxxx
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  shareButton: {
    padding: 8,
  },
  shareButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  content: {
    flex: 1,
  },
  invoiceHeader: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusCompleted: {
    backgroundColor: "#34C759",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  statusSuccess: {
    color: "#34C759",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#888",
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  footer: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  footerSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default InvoiceScreen;
