import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";

export default function EditProfileScreen({ navigation }: any) {
  const [profile, setProfile] = React.useState({
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "user@example.com",
    vehicleModel: "VinFast Evo200",
    licensePlate: "59H1-23456",
    vin: "VNFEV200123456789",
    manufactureYear: "2023",
  });

  const handleSave = () => {
    // Save profile changes
    console.log("Save profile:", profile);
    navigation.goBack();
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
              Họ và tên
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.fullName}
              onChangeText={(value) => updateField("fullName", value)}
              placeholder="Nhập họ và tên"
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

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Thông tin xe
          </Text>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Model xe
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.vehicleModel}
              onChangeText={(value) => updateField("vehicleModel", value)}
              placeholder="Nhập model xe"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Biển số xe
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.licensePlate}
              onChangeText={(value) => updateField("licensePlate", value)}
              placeholder="Nhập biển số xe"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Số VIN
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.vin}
              onChangeText={(value) => updateField("vin", value)}
              placeholder="Nhập số VIN"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.text.secondary }]}
            >
              Năm sản xuất
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.default,
                },
              ]}
              value={profile.manufactureYear}
              onChangeText={(value) => updateField("manufactureYear", value)}
              placeholder="Nhập năm sản xuất"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
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
