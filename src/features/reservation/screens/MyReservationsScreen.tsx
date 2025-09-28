import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainTabParamList } from "../../../navigation/types";
import { mockReservations } from "../../../data/mockData";
import type { Reservation } from "../../../data/mockData";
import Button from "../../../components/ui/Button";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styleTokens } from "../../../styles/tokens";

type Props = NativeStackScreenProps<MainTabParamList, "MyReservations">;

export default function MyReservationsScreen({ navigation }: Props) {
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<"active" | "history">("active");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000); // update each minute
    return () => clearInterval(id);
  }, []);

  const reservationsAugmented = useMemo(() => {
    return mockReservations.map((r) => {
      const remainingMs = r.expiredAt.getTime() - now;
      const remainingMinutes = Math.max(0, Math.floor(remainingMs / 60000));
      // derive dynamic expired status
      const derivedStatus =
        r.status === "active" && remainingMinutes === 0 ? "expired" : r.status;
      return { ...r, remainingMinutes, derivedStatus } as Reservation & {
        remainingMinutes: number;
        derivedStatus: Reservation["status"];
      };
    });
  }, [now]);

  const activeReservations = reservationsAugmented.filter(
    (r) => r.derivedStatus === "active"
  );
  const historyReservations = reservationsAugmented.filter(
    (r) => r.derivedStatus !== "active"
  );

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert("Hủy đặt pin", "Bạn có chắc chắn muốn hủy đặt pin này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy đặt",
        style: "destructive",
        onPress: () => {
          // TODO: Integrate cancel reservation API
          Alert.alert("Thành công", "Đã hủy đặt pin thành công!");
        },
      },
    ]);
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Đang chờ", color: styleTokens.colors.success },
    completed: { label: "Hoàn thành", color: styleTokens.colors.primary },
    expired: { label: "Hết hạn", color: "#f59e0b" },
    cancelled: { label: "Đã hủy", color: styleTokens.colors.danger },
  };

  const renderCard = useCallback(
    (
      item: Reservation & { remainingMinutes: number; derivedStatus: string }
    ) => {
      const cfg = statusConfig[item.derivedStatus] || statusConfig[item.status];
      const showCountdown = item.derivedStatus === "active";

      // Visual emphasis variants for countdown
      const getCountdownVisual = (mins: number) => {
        if (mins <= 5)
          return {
            box: styles.countdownUrgent,
            accent: "#dc2626",
            icon: "#dc2626",
          };
        if (mins <= 15)
          return {
            box: styles.countdownWarn,
            accent: "#d97706",
            icon: "#d97706",
          };
        return {
          box: styles.countdownSafe,
          accent: "#047857",
          icon: "#059669",
        };
      };
      const countdownVisual = getCountdownVisual(item.remainingMinutes);

      return (
        <View style={styles.cardWrapper}>
          <View style={[styles.reservationCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.stationName}>{item.stationName}</Text>
              <View style={[styles.badge, { backgroundColor: cfg.color }]}>
                <Text style={styles.badgeText}>{cfg.label}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Loại pin</Text>
              <Text style={styles.metaValue}>Pin {item.batteryType}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Đặt lúc</Text>
              <Text style={styles.metaValueSmall}>
                {item.reservedAt.toLocaleString("vi-VN")}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Đến dự kiến</Text>
              <Text style={styles.metaValueSmall}>
                {item.estimatedArrival.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            {showCountdown && (
              <View style={[styles.countdownBox, countdownVisual.box]}>
                <View style={styles.countdownLeft}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={countdownVisual.icon}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.countdownLabel]}>Còn lại</Text>
                </View>
                <Text
                  style={[
                    styles.countdownValue,
                    { color: countdownVisual.accent },
                  ]}
                >
                  {item.remainingMinutes}
                  <Text style={styles.countdownValueUnit}> phút</Text>
                </Text>
              </View>
            )}
            {showCountdown && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => handleCancelReservation(item.id)}
                >
                  <Text style={styles.actionBtnText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.outlineBtn]}
                  onPress={() =>
                    Alert.alert(
                      "Chỉ đường",
                      "Mở ứng dụng bản đồ để đi đến trạm?"
                    )
                  }
                >
                  <Text style={styles.outlineBtnText}>Chỉ đường</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    },
    [statusConfig]
  );

  const dataToRender =
    tab === "active" ? activeReservations : historyReservations;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt trước của tôi</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          onPress={() => setTab("active")}
          style={[
            styles.tabBtn,
            tab === "active" ? styles.tabActive : styles.tabInactive,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.tabText, tab === "active" && styles.tabTextActive]}
          >
            Đang chờ ({activeReservations.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("history")}
          style={[
            styles.tabBtn,
            tab === "history" ? styles.tabActive : styles.tabInactive,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.tabText, tab === "history" && styles.tabTextActive]}
          >
            Lịch sử ({historyReservations.length})
          </Text>
        </TouchableOpacity>
      </View>

      {dataToRender.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Chưa có đặt trước</Text>
          <Text style={styles.emptySubtitle}>
            Bạn chưa tạo đặt trước nào. Tìm trạm phù hợp và đặt trước để giữ pin
            sẵn sàng.
          </Text>
          <Button
            title="Tìm trạm"
            onPress={() => navigation.navigate("Home")}
            variant="primary"
            size="medium"
            style={styles.ctaBtn}
          />
        </View>
      ) : (
        <FlatList
          data={dataToRender}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => renderCard(item as any)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: styleTokens.spacing.lg,
  },
  header: {
    paddingVertical: styleTokens.spacing.lg,
  },
  headerTitle: {
    ...styleTokens.typography.headline,
    fontSize: 20,
    textAlign: "center",
    color: "#111827",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: styleTokens.radius + 4,
    padding: 4,
    marginBottom: styleTokens.spacing.lg,
    borderWidth: 1,
    borderColor: "#d8e1e8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: styleTokens.radius,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#5D7B6F",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  tabTextActive: {
    color: styleTokens.colors.white,
  },
  listContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: styleTokens.spacing.lg,
  },
  reservationCard: {
    backgroundColor: "#ffffff",
    borderRadius: styleTokens.radius,
    padding: styleTokens.spacing.lg,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: styleTokens.spacing.md,
  },
  stationName: {
    flex: 1,
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: styleTokens.colors.white,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  metaValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  metaValueSmall: {
    fontSize: 13,
    color: "#111827",
  },
  countdownBox: {
    marginTop: 10,
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: styleTokens.radius - 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countdownLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownSafe: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  countdownWarn: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  countdownUrgent: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  countdownLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  countdownValue: {
    fontSize: 16,
    fontWeight: "700",
    color: styleTokens.colors.primary,
  },
  countdownValueUnit: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: styleTokens.spacing.md,
    gap: styleTokens.spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: styleTokens.radius - 6,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: styleTokens.colors.danger,
  },
  actionBtnText: {
    color: styleTokens.colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: styleTokens.colors.primary,
    backgroundColor: "transparent",
  },
  outlineBtnText: {
    color: styleTokens.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: styleTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: styleTokens.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: styleTokens.spacing.lg,
    lineHeight: 20,
  },
  ctaBtn: {
    alignSelf: "stretch",
  },
});
