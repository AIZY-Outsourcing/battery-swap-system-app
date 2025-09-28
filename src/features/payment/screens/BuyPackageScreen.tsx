import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "BuyPackage">;

type SubscriptionPackage = {
  id: string;
  name: string;
  duration: number; // days
  price: number;
  description: string;
  unlimited: boolean;
  popular?: boolean;
};

const PACKAGES: SubscriptionPackage[] = [
  {
    id: "m1",
    name: "Gói tháng",
    duration: 30,
    price: 2000000,
    description: "Đổi pin không giới hạn trong 30 ngày",
    unlimited: true,
    popular: true,
  },
  {
    id: "m3",
    name: "Gói 3 tháng",
    duration: 90,
    price: 5500000,
    description: "Không giới hạn 90 ngày - Tiết kiệm 500.000đ",
    unlimited: true,
  },
  {
    id: "m6",
    name: "Gói 6 tháng",
    duration: 180,
    price: 10000000,
    description: "Không giới hạn 180 ngày - Tiết kiệm 1.000.000đ",
    unlimited: true,
  },
];

export default function BuyPackageScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PACKAGES.find((p) => p.id === selectedId) || null;

  const formatVnd = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

  const handleConfirm = () => {
    if (!selected) {
      Alert.alert("Chưa chọn gói", "Vui lòng chọn gói đăng ký");
      return;
    }
    navigation.navigate("PaymentScreen", {
      amount: selected.price,
      type: "subscription",
      subscriptionId: selected.id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
      >
        <Text style={styles.headerTitle}>Chọn gói đăng ký</Text>

        {PACKAGES.map((pkg) => {
          const active = selectedId === pkg.id;
          return (
            <TouchableOpacity
              key={pkg.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelectedId(pkg.id)}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>PHỔ BIẾN</Text>
                </View>
              )}
              <View style={styles.cardHeader}>
                <View
                  style={[styles.cardIcon, active && styles.cardIconActive]}
                >
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={20}
                    color={active ? "#ffffff" : "#5D7B6F"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{pkg.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {pkg.duration} ngày •{" "}
                    {pkg.unlimited ? "Không giới hạn" : "Giới hạn"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardPrice,
                    active && styles.cardPriceActive,
                    pkg.popular && styles.cardPriceBump,
                  ]}
                >
                  {formatVnd(pkg.price)}
                </Text>
              </View>
              <Text style={styles.cardDesc}>{pkg.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tổng thanh toán</Text>
          <Text style={styles.summaryValue}>
            {selected ? formatVnd(selected.price) : "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, !selected && styles.payBtnDisabled]}
          disabled={!selected}
          onPress={handleConfirm}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={18}
            color="#ffffff"
          />
          <Text style={styles.payBtnText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8f9" },
  content: { flex: 1, padding: 16 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eaeaea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  cardActive: { borderColor: "#5D7B6F", shadowOpacity: 0.1 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F20",
  },
  cardIconActive: { backgroundColor: "#5D7B6F" },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  cardSubtitle: { fontSize: 12, color: "#666" },
  cardPrice: { fontWeight: "700", color: "#111", marginTop: 20 },
  cardPriceBump: { alignSelf: "flex-start", marginTop: 20 },
  cardPriceActive: { color: "#5D7B6F" },
  cardDesc: { marginTop: 8, color: "#333" },
  popularBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: { color: "#2E7D32", fontSize: 10, fontWeight: "700" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { color: "#666" },
  summaryValue: { color: "#111", fontWeight: "700" },
  payBtn: {
    backgroundColor: "#5D7B6F",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { color: "#fff", fontWeight: "700" },
});
