import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

interface PaymentPackage {
  id: string;
  name: string;
  swapCount: number;
  price: number;
  description: string;
  isPopular?: boolean;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  duration: number; // days
  price: number;
  description: string;
  unlimited: boolean;
}

const PaymentPackagesScreen = () => {
  const [activeTab, setActiveTab] = useState<"swap" | "subscription">("swap");
  const [userSwapCount] = useState(12); // Mock user's remaining swaps
  const [userSubscription] = useState(null); // Mock user's subscription

  const swapPackages: PaymentPackage[] = [
    {
      id: "1",
      name: "Gói Cơ bản",
      swapCount: 5,
      price: 300000,
      description: "5 lượt đổi pin - Tiết kiệm cho người dùng ít",
    },
    {
      id: "2",
      name: "Gói Phổ biến",
      swapCount: 10,
      price: 550000,
      description: "10 lượt đổi pin - Tiết kiệm 50,000đ",
      isPopular: true,
    },
    {
      id: "3",
      name: "Gói Siêu tiết kiệm",
      swapCount: 20,
      price: 1000000,
      description: "20 lượt đổi pin - Tiết kiệm 200,000đ",
    },
  ];

  const subscriptionPackages: SubscriptionPackage[] = [
    {
      id: "1",
      name: "Gói tháng",
      duration: 30,
      price: 2000000,
      description: "30 ngày đổi pin không giới hạn",
      unlimited: true,
    },
    {
      id: "2",
      name: "Gói 3 tháng",
      duration: 90,
      price: 5500000,
      description: "90 ngày đổi pin không giới hạn - Tiết kiệm 500,000đ",
      unlimited: true,
    },
  ];

  const handlePurchaseSwapPackage = (pkg: PaymentPackage) => {
    Alert.alert(
      "Xác nhận mua gói",
      `Bạn có muốn mua ${pkg.name} với giá ${pkg.price.toLocaleString(
        "vi-VN"
      )}đ?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Mua ngay",
          onPress: () => {
            // Navigate to payment screen
            Alert.alert("Thành công", "Chuyển đến trang thanh toán...");
          },
        },
      ]
    );
  };

  const handlePurchaseSubscription = (pkg: SubscriptionPackage) => {
    Alert.alert(
      "Xác nhận đăng ký",
      `Bạn có muốn đăng ký ${pkg.name} với giá ${pkg.price.toLocaleString(
        "vi-VN"
      )}đ?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng ký",
          onPress: () => {
            // Navigate to payment screen
            Alert.alert("Thành công", "Chuyển đến trang thanh toán...");
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thanh toán & Gói dịch vụ</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Bạn còn {userSwapCount} lượt đổi
          </Text>
          {userSubscription && (
            <Text style={styles.userInfoText}>Gói còn 15 ngày</Text>
          )}
        </View>
      </View>

      {/* Tab Selector */}
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
            Mua lượt đổi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "subscription" && styles.activeTab]}
          onPress={() => setActiveTab("subscription")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "subscription" && styles.activeTabText,
            ]}
          >
            Gói đăng ký
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "swap" ? (
          /* Swap Packages */
          <View style={styles.packagesContainer}>
            {swapPackages.map((pkg) => (
              <View
                key={pkg.id}
                style={[
                  styles.packageCard,
                  pkg.isPopular && styles.popularCard,
                ]}
              >
                {pkg.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>PHỔ BIẾN</Text>
                  </View>
                )}
                <Text style={styles.packageName}>{pkg.name}</Text>
                <Text style={styles.packagePrice}>
                  {formatPrice(pkg.price)}
                </Text>
                <Text style={styles.packageSwapCount}>
                  {pkg.swapCount} lượt đổi
                </Text>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    pkg.isPopular && styles.popularButton,
                  ]}
                  onPress={() => handlePurchaseSwapPackage(pkg)}
                >
                  <Text
                    style={[
                      styles.purchaseButtonText,
                      pkg.isPopular && styles.popularButtonText,
                    ]}
                  >
                    Mua ngay
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          /* Subscription Packages */
          <View style={styles.packagesContainer}>
            {subscriptionPackages.map((pkg) => (
              <View key={pkg.id} style={styles.packageCard}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                <Text style={styles.packagePrice}>
                  {formatPrice(pkg.price)}
                </Text>
                <Text style={styles.packageDuration}>{pkg.duration} ngày</Text>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handlePurchaseSubscription(pkg)}
                >
                  <Text style={styles.purchaseButtonText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  userInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  userInfoText: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  packagesContainer: {
    padding: 16,
  },
  packageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  popularCard: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  packageName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  packageSwapCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  packageDuration: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  popularButton: {
    backgroundColor: "#FF6B35",
  },
  purchaseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  popularButtonText: {
    color: "#ffffff",
  },
});

export default PaymentPackagesScreen;
