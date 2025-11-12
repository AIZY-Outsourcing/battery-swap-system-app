import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";
import { useAuthStore } from "../../../store/authStore";
import UserService from "../../../services/api/UserService";

export default function EditProfileScreen({ navigation }: any) {
  const { user: authUser, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = React.useState({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
  });

  const handleSave = async () => {
    if (!authUser?.id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    // Combine firstName and lastName into name for backend
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    try {
      setLoading(true);
      const response = await UserService.updateProfile(authUser.id, {
        name: fullName,
        phone: profile.phone,
        email: profile.email,
      });

      // Update local store with updated user
      setUser({
        ...authUser,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View style={styles.content}>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Thông tin cá nhân
          </Text>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Họ
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.firstName}
              onChangeText={(value) => updateField("firstName", value)}
              placeholder="Nhập họ"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Tên
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.lastName}
              onChangeText={(value) => updateField("lastName", value)}
              placeholder="Nhập tên"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Số điện thoại
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.phone}
              onChangeText={(value) => updateField("phone", value)}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.email}
              onChangeText={(value) => updateField("email", value)}
              placeholder="Nhập email"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
