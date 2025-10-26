import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { ThemedButton } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
            name="battery-charging-medium" 
            size={48} 
            color="#5D7B6F" 
          />
        </View>
        <Text style={styles.appName}>BSS</Text>
        <Text style={styles.appSubtitle}>Battery Swapping System</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Chào mừng đến với BSS</Text>
          <Text style={styles.welcomeSubtitle}>
            Giải pháp đổi pin xe điện thông minh và tiện lợi
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#5D7B6F" />
            <Text style={styles.featureText}>Đổi pin nhanh chóng</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#5D7B6F" />
            <Text style={styles.featureText}>Mạng lưới trạm rộng khắp</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#5D7B6F" />
            <Text style={styles.featureText}>An toàn và đáng tin cậy</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <ThemedButton
          title="Đăng nhập"
          onPress={() => navigation.navigate("Login")}
          fullWidth
          style={styles.loginButton}
        />
        <ThemedButton
          title="Tạo tài khoản"
          onPress={() => navigation.navigate("Register")}
          variant="secondary"
          fullWidth
          style={styles.registerButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D7F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#B0D4B8",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#5D7B6F",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAE7D6",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B0D4B8",
  },
  featureText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
    marginLeft: 12,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#5D7B6F",
    paddingVertical: 16,
    borderRadius: 12,
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#5D7B6F",
    paddingVertical: 16,
    borderRadius: 12,
  },
});
