import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";
import { useAuthStore } from "../../../store/authStore";

export default function SettingsScreen({ navigation }: any) {
  const logout = useAuthStore((state) => state.logout);
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: false,
    autoReserve: true,
    locationServices: true,
    dataUsage: false,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // Navigate to auth stack
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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xóa tài khoản",
      "Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => console.log("Delete account"),
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    description,
    value,
    onToggle,
    showArrow = false,
    onPress,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={showArrow ? onPress : undefined}
      disabled={!showArrow && !onToggle}
    >
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, { color: theme.colors.text.primary }]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#D1DDD3", true: theme.colors.primary }}
        />
      )}
      {showArrow && (
        <Text style={[styles.arrow, { color: theme.colors.text.secondary }]}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Thông báo
          </Text>

          <SettingItem
            title="Thông báo push"
            description="Nhận thông báo về trạng thái đặt trạm và pin"
            value={settings.notifications}
            onToggle={() => toggleSetting("notifications")}
          />

          <SettingItem
            title="Tự động đặt trạm"
            description="Tự động đặt trạm khi pin dưới 20%"
            value={settings.autoReserve}
            onToggle={() => toggleSetting("autoReserve")}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Bảo mật
          </Text>

          <SettingItem
            title="Sinh trường học/Vân tay"
            description="Sử dụng FaceID hoặc vân tay để đăng nhập"
            value={settings.biometric}
            onToggle={() => toggleSetting("biometric")}
          />

          <SettingItem
            title="Thay đổi mật khẩu"
            showArrow={true}
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Quyền riêng tư
          </Text>

          <SettingItem
            title="Dịch vụ vị trí"
            description="Cho phép ứng dụng truy cập vị trí để tìm trạm gần nhất"
            value={settings.locationServices}
            onToggle={() => toggleSetting("locationServices")}
          />

          <SettingItem
            title="Sử dụng dữ liệu 3G/4G"
            description="Cho phép tải dữ liệu qua mạng di động"
            value={settings.dataUsage}
            onToggle={() => toggleSetting("dataUsage")}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Thông tin
          </Text>

          <SettingItem
            title="Điều khoản sử dụng"
            showArrow={true}
            onPress={() => navigation.navigate("Terms")}
          />

          <SettingItem
            title="Chính sách bảo mật"
            showArrow={true}
            onPress={() => navigation.navigate("Privacy")}
          />

          <SettingItem
            title="Về ứng dụng"
            description="Phiên bản 1.0.0"
            showArrow={true}
            onPress={() => navigation.navigate("About")}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.dangerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 20,
    marginLeft: 8,
  },
  dangerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
  },
});
