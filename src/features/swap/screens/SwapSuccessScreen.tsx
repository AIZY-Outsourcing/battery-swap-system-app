import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { theme } from "../../../theme";

interface SwapSuccessScreenProps {
  navigation: any;
}

export const SwapSuccessScreen: React.FC<SwapSuccessScreenProps> = ({
  navigation,
}) => {
  const handleContinue = () => {
    // Navigate back to home or map
    navigation.navigate("Home");
  };

  const handleViewHistory = () => {
    navigation.navigate("SwapHistory");
  };

  const swapDetails = {
    station: "Vincom Bà Triệu",
    address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
    time: "14:32 - 21/12/2024",
    oldBatteryLevel: "15%",
    newBatteryLevel: "98%",
    swapDuration: "2 phút 45 giây",
    cost: "15.000 VND",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Icon */}
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✅</Text>
        </View>
        <Text style={styles.successTitle}>Đổi pin thành công!</Text>
        <Text style={styles.successSubtitle}>
          Pin mới đã được lắp đặt và sẵn sàng sử dụng
        </Text>
      </View>

      {/* Battery Status */}
      <View style={styles.batteryContainer}>
        <View style={styles.batteryComparison}>
          <View style={styles.batteryStatus}>
            <Text style={styles.batteryLabel}>Pin cũ</Text>
            <View style={styles.batteryBar}>
              <View
                style={[
                  styles.batteryFill,
                  styles.batteryFillOld,
                  { width: "15%" },
                ]}
              />
            </View>
            <Text style={styles.batteryLevel}>
              {swapDetails.oldBatteryLevel}
            </Text>
          </View>

          <Text style={styles.arrowIcon}>→</Text>

          <View style={styles.batteryStatus}>
            <Text style={styles.batteryLabel}>Pin mới</Text>
            <View style={styles.batteryBar}>
              <View
                style={[
                  styles.batteryFill,
                  styles.batteryFillNew,
                  { width: "98%" },
                ]}
              />
            </View>
            <Text style={styles.batteryLevel}>
              {swapDetails.newBatteryLevel}
            </Text>
          </View>
        </View>
      </View>

      {/* Swap Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Chi tiết đổi pin</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Trạm</Text>
          <Text style={styles.detailValue}>{swapDetails.station}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Địa chỉ</Text>
          <Text style={styles.detailValue}>{swapDetails.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian</Text>
          <Text style={styles.detailValue}>{swapDetails.time}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian đổi</Text>
          <Text style={styles.detailValue}>{swapDetails.swapDuration}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Chi phí</Text>
          <Text style={styles.detailValue}>{swapDetails.cost}</Text>
        </View>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Đánh giá trải nghiệm</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} style={styles.star}>
              <Text style={styles.starIcon}>⭐</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingSubtext}>
          Hãy để lại đánh giá để giúp chúng tôi cải thiện dịch vụ
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleViewHistory}
        >
          <Text style={styles.historyButtonText}>Xem lịch sử</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.default,
    paddingHorizontal: 16,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface.elevated,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: theme.colors.success,
  },
  successEmoji: {
    fontSize: 50,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  batteryContainer: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  batteryComparison: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  batteryStatus: {
    flex: 1,
    alignItems: "center",
  },
  batteryLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  batteryBar: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.border.default,
    borderRadius: 4,
    marginBottom: 8,
  },
  batteryFill: {
    height: "100%",
    borderRadius: 4,
  },
  batteryFillOld: {
    backgroundColor: theme.colors.error,
  },
  batteryFillNew: {
    backgroundColor: theme.colors.success,
  },
  batteryLevel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  arrowIcon: {
    fontSize: 20,
    color: theme.colors.text.secondary,
    marginHorizontal: 16,
  },
  detailsContainer: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  ratingContainer: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    padding: 4,
  },
  starIcon: {
    fontSize: 24,
  },
  ratingSubtext: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 20,
  },
  historyButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  historyButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
