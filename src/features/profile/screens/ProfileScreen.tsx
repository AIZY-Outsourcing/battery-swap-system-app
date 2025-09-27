import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthService from "../../../services/auth/AuthService";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  hasToggle = false,
  toggleValue = false,
  onToggle,
  showArrow = true,
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    disabled={hasToggle}
  >
    <View style={styles.menuItemLeft}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    {hasToggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggle}
        thumbColor={toggleValue ? "#007AFF" : "#f4f3f4"}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
      />
    ) : (
      showArrow && <Text style={styles.arrow}>›</Text>
    )}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }: Props) {
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);
  const [language, setLanguage] = useState("vietnamese");

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.clearAuth();
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>mih</Text>
              <Text style={styles.userPhone}>039-462-9319</Text>
              <Text style={styles.userStatus}>Hoạt động từ: 24/09/2025</Text>
            </View>
          </View>
        </View>

        {/* Face ID Toggle */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="�"
            title="Đăng nhập bằng FaceID"
            hasToggle={true}
            toggleValue={faceIDEnabled}
            onToggle={setFaceIDEnabled}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="🎁"
            title="Khuyến mại"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <MenuItem
            icon="📖"
            title="Hướng dẫn sử dụng"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <MenuItem
            icon="❓"
            title="Câu hỏi thường gặp"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <MenuItem
            icon="💬"
            title="Trung tâm trợ giúp"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <MenuItem
            icon="🎧"
            title="Yêu cầu hỗ trợ"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />

          <MenuItem
            icon="📋"
            title="Điều khoản sử dụng"
            onPress={() =>
              Alert.alert("Thông báo", "Tính năng đang phát triển")
            }
          />
        </View>

        {/* Language Section */}
        <View style={styles.menuContainer}>
          <View style={styles.languageSection}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🌐</Text>
              <Text style={styles.menuTitle}>Đổi ngôn ngữ</Text>
            </View>
            <View style={styles.languageOptions}>
              <TouchableOpacity style={styles.languageOption}>
                <Text style={styles.languageFlag}>🇻🇳</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption}>
                <Text style={styles.languageFlag}>🇬🇧</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>↗️</Text>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            Phiên bản: 2.30.6(2025.0818.1510)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  profileCard: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4a90e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  onlineIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff4444",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: "#888888",
  },
  menuContainer: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#3a3a3a",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuTitle: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: "#666666",
  },
  languageSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  languageOptions: {
    flexDirection: "row",
    gap: 12,
  },
  languageOption: {
    padding: 4,
  },
  languageFlag: {
    fontSize: 24,
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "500",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: "#666666",
  },
});
