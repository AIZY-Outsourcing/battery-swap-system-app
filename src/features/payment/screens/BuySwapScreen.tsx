import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { orderService } from "../../../services/api/OrderService";
import { useNotification } from "../../../contexts/NotificationContext";

type Props = NativeStackScreenProps<RootStackParamList, "BuySwap">;

const SWAP_OPTIONS = [
  { id: "1", swaps: 1, price: 25000 },
  { id: "3", swaps: 3, price: 75000 },
  { id: "5", swaps: 5, price: 125000 },
  { id: "10", swaps: 10, price: 250000 },
];

export default function BuySwapScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const preset = route.params?.preset;
  const [selectedId, setSelectedId] = useState<string | null>(
    typeof preset === "number" ? String(preset) : null
  );
  const [customCount, setCustomCount] = useState<number | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { showNotification } = useNotification();

  const BASE_PRICE = 25000; // VND per swap when custom

  const selected = SWAP_OPTIONS.find((o) => o.id === selectedId) || null;

  const formatVnd = (amount: number) =>
    amount.toLocaleString(i18n.language.startsWith("vi") ? "vi-VN" : "en-US") +
    (i18n.language.startsWith("vi") ? "đ" : "₫");

  const total = useMemo(() => {
    if (selected) return selected.price;
    if (customCount && customCount > 0) return customCount * BASE_PRICE;
    return 0;
  }, [selected, customCount]);

  const canPay = useMemo(
    () => !!selected || !!(customCount && customCount > 0),
    [selected, customCount]
  );

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const handleDec = () => {
    setSelectedId(null);
    setCustomCount((prev) => {
      const next = clamp((prev ?? 1) - 1, 1, 100);
      return next;
    });
  };
  const handleInc = () => {
    setSelectedId(null);
    setCustomCount((prev) => {
      const next = clamp((prev ?? 0) + 1, 1, 100);
      return next;
    });
  };
  const handleInput = (t: string) => {
    setSelectedId(null);
    const digits = t.replace(/[^0-9]/g, "");
    if (!digits) return setCustomCount(null);
    const n = clamp(parseInt(digits, 10) || 0, 1, 100);
    setCustomCount(n);
  };

  const handleConfirm = async () => {
    if (!canPay) {
      showNotification({
        type: "warning",
        title: t("buySwap.alert.noSelection.title"),
        message: t("buySwap.alert.noSelection.message"),
        duration: 3000,
      });
      return;
    }

    try {
      setCreatingOrder(true);
      
      // Determine quantity
      let quantity = 0;
      if (selected) {
        quantity = selected.swaps;
      } else if (customCount && customCount > 0) {
        quantity = customCount;
      }

      // Create order for single swaps
      const orderResponse = await orderService.createOrder({
        type: "single",
        quantity: quantity,
      });

      if (orderResponse.success && orderResponse.data) {
        // Navigate to order details screen with the created order data
        navigation.navigate("OrderDetails", {
          order: orderResponse.data,
        });
      } else {
        showNotification({
          type: "error",
          title: t("buySwap.alert.orderFailed.title"),
          message: orderResponse.error?.message || t("buySwap.alert.orderFailed.message"),
          duration: 4000,
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: t("buySwap.alert.orderFailed.title"),
        message: t("buySwap.alert.orderFailed.message"),
        duration: 4000,
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
      >
        <Text style={styles.headerTitle}>{t("buySwap.title")}</Text>

        <View style={styles.grid}>
          {SWAP_OPTIONS.map((opt) => {
            const active = selectedId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setSelectedId(opt.id)}
              >
                <View
                  style={[styles.cardIcon, active && styles.cardIconActive]}
                >
                  <MaterialCommunityIcons
                    name="battery"
                    size={20}
                    color={active ? "#ffffff" : "#5D7B6F"}
                  />
                </View>
                <Text style={styles.cardTitle}>
                  {opt.swaps} {i18n.language.startsWith("vi") ? "lượt" : "x"}
                </Text>
                <Text
                  style={[styles.cardPrice, active && styles.cardPriceActive]}
                >
                  {formatVnd(opt.price)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom count */}
        <View style={styles.customCard}>
          <View style={styles.customHeader}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color="#5D7B6F"
            />
            <Text style={styles.customTitle}>{t("buySwap.custom")}</Text>
          </View>
          <View style={styles.customRow}>
            <TouchableOpacity style={styles.stepBtn} onPress={handleDec}>
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              value={customCount ? String(customCount) : ""}
              onChangeText={handleInput}
              keyboardType="number-pad"
              placeholder="0"
              style={styles.countInput}
              inputMode="numeric"
              maxLength={3}
            />
            <TouchableOpacity style={styles.stepBtn} onPress={handleInc}>
              <Text style={styles.stepBtnText}>＋</Text>
            </TouchableOpacity>
            <Text style={styles.perUnit}>
              x {formatVnd(BASE_PRICE)}
              {t("buySwap.unitSuffix")}
            </Text>
          </View>
          <Text style={styles.note}>{t("buySwap.noteMax")}</Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          <View style={styles.benefitRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#5D7B6F"
            />
            <Text style={styles.benefitText}>
              {t("buySwap.benefit.instant")}
            </Text>
          </View>
          {/* <View style={styles.benefitRow}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={18}
              color="#5D7B6F"
            />
            <Text style={styles.benefitText}>Giá tốt hơn mua lẻ tại trạm</Text>
          </View> */}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t("buySwap.total")}</Text>
          <Text style={styles.summaryValue}>
            {canPay ? formatVnd(total) : "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, (!canPay || creatingOrder) && styles.payBtnDisabled]}
          disabled={!canPay || creatingOrder}
          onPress={handleConfirm}
        >
          {creatingOrder ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color="#ffffff"
            />
          )}
          <Text style={styles.payBtnText}>
            {creatingOrder ? t("buySwap.creating") : t("buySwap.pay")}
          </Text>
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47.8%",
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
  },
  cardActive: { borderColor: "#5D7B6F", shadowOpacity: 0.1 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F20",
    marginBottom: 10,
  },
  cardIconActive: { backgroundColor: "#5D7B6F" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  cardPrice: { marginTop: 2, fontSize: 14, color: "#666" },
  cardPriceActive: { color: "#5D7B6F" },
  customCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  customTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  customRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f2f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { fontSize: 22, color: "#111" },
  countInput: {
    width: 72,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    textAlign: "center",
    fontSize: 16,
    color: "#111",
    paddingVertical: 0,
    paddingHorizontal: 6,
  },
  perUnit: { marginLeft: "auto", color: "#666" },
  note: { marginTop: 8, color: "#666" },
  benefits: { marginTop: 20, gap: 10 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  benefitText: { color: "#333" },
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
