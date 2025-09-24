import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, ThemedButton } from "../../../components";
import AuthService from "../../../services/auth/AuthService";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.clearAuth();
            // Navigate back to auth stack
            (navigation as any).getParent()?.reset({
              index: 0,
              routes: [{ name: "AuthStack" }],
            });
          } catch (error) {
            Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const menuSections = [
    {
      title: "Tài khoản",
      items: [
        {
          icon: "👤",
          title: "Thông tin cá nhân",
          onPress: () =>
            (navigation as any).getParent()?.navigate("EditProfile"),
        },
        {
          icon: "🚗",
          title: "Thông tin xe",
          onPress: () =>
            (navigation as any).getParent()?.navigate("VehicleProfile"),
        },
      ],
    },
    {
      title: "Ví & Thanh toán",
      items: [
        {
          icon: "💳",
          title: "Phương thức thanh toán",
          onPress: () =>
            (navigation as any).getParent()?.navigate("PaymentMethods"),
        },
        {
          icon: "📋",
          title: "Gói đăng ký",
          onPress: () =>
            (navigation as any).getParent()?.navigate("Subscription"),
        },
        {
          icon: "📄",
          title: "Hóa đơn",
          onPress: () =>
            (navigation as any).getParent()?.navigate("PaymentHistory"),
        },
      ],
    },
    {
      title: "Hỗ trợ & Cộng đồng",
      items: [
        {
          icon: "💬",
          title: "Hỗ trợ khách hàng",
          onPress: () =>
            Alert.alert(
              "Thông báo",
              "Tính năng hỗ trợ sẽ có trong phiên bản tiếp theo"
            ),
        },
        {
          icon: "⭐",
          title: "Đánh giá đã gửi",
          onPress: () =>
            Alert.alert(
              "Thông báo",
              "Tính năng sẽ có trong phiên bản tiếp theo"
            ),
        },
        {
          icon: "📞",
          title: "Hotline: 1900-1234",
          onPress: () =>
            Alert.alert(
              "Liên hệ",
              "Bạn có thể gọi hotline 1900-1234 để được hỗ trợ"
            ),
        },
      ],
    },
    {
      title: "Cài đặt & Bảo mật",
      items: [
        {
          icon: "⚙️",
          title: "Cài đặt ứng dụng",
          onPress: () => (navigation as any).getParent()?.navigate("Settings"),
        },
        {
          icon: "👆",
          title: "Bảo mật (Face ID/Vân tay)",
          onPress: () =>
            Alert.alert(
              "Bảo mật",
              "Tính năng sinh trắc học sẽ có trong phiên bản tiếp theo"
            ),
        },
        {
          icon: "📋",
          title: "Chính sách & Điều khoản",
          onPress: () =>
            Alert.alert(
              "Thông báo",
              "Trang chính sách sẽ được mở trong trình duyệt"
            ),
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <ThemedCard style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={[styles.profileName, { color: theme.colors.text.primary }]}
          >
            John Doe
          </Text>
          <Text
            style={[
              styles.profileEmail,
              { color: theme.colors.text.secondary },
            ]}
          >
            john.doe@email.com
          </Text>
          <Text
            style={[styles.profilePhone, { color: theme.colors.text.tertiary }]}
          >
            +84 901 234 567
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            (navigation as any).getParent()?.navigate("EditProfile")
          }
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </ThemedCard>

      {/* Vehicle Info */}
      <ThemedCard style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            🚗 Thông tin xe
          </Text>
        </View>
        <View style={styles.vehicleInfo}>
          <Text
            style={[
              styles.vehicleDetail,
              { color: theme.colors.text.secondary },
            ]}
          >
            Tesla Model 3 2023
          </Text>
          <Text
            style={[
              styles.vehicleDetail,
              { color: theme.colors.text.secondary },
            ]}
          >
            Pin: LG Chem • Biển số: 30A-12345
          </Text>
          <Text style={[styles.vehicleStatus, { color: theme.colors.success }]}>
            ✅ Đã xác thực
          </Text>
        </View>
      </ThemedCard>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            {section.title}
          </Text>
          <ThemedCard style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.menuItem,
                  itemIndex < section.items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.default,
                  },
                ]}
                onPress={item.onPress}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.menuArrow,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </ThemedCard>
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <ThemedButton
          title="🔓 Đăng xuất"
          variant="secondary"
          onPress={handleLogout}
          fullWidth
          style={{
            backgroundColor: theme.colors.error,
            borderColor: theme.colors.error,
          }}
        />
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text
          style={[styles.versionText, { color: theme.colors.text.tertiary }]}
        >
          BSS App v1.0.0 🔋
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    padding: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 18,
  },
  vehicleCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
  },
  vehicleHeader: {
    marginBottom: 12,
  },
  vehicleInfo: {
    gap: 4,
  },
  vehicleDetail: {
    fontSize: 14,
  },
  vehicleStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: "300",
  },
  logoutContainer: {
    margin: 20,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
  },
});
