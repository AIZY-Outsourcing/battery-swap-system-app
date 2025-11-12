import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "../../../i18n";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainTabParamList } from "../../../navigation/types";
import Button from "../../../components/ui/Button";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styleTokens } from "../../../styles/tokens";
import ReservationService, {
  Reservation,
} from "../../../services/api/ReservationService";

type Props = NativeStackScreenProps<MainTabParamList, "MyReservations">;

export default function MyReservationsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<"active" | "history">("active");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000); // update each minute
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await ReservationService.getMyReservations();
      console.log("Reservations response:", JSON.stringify(response, null, 2));
      console.log("response type:", typeof response);
      console.log("response:", response);

      // Response is already Reservation[]
      const reservationsData = Array.isArray(response) ? response : [];

      setReservations(reservationsData);
    } catch (error: any) {
      console.error("Error loading reservations:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách đặt chỗ";
      Alert.alert("Lỗi", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  }, []);

  const reservationsAugmented = useMemo(() => {
    return reservations.map((r) => {
      const expirationTime = new Date(r.expiration_at).getTime();
      const remainingMs = expirationTime - now;
      const remainingMinutes = Math.max(0, Math.floor(remainingMs / 60000));

      // Derive dynamic status based on API status
      let derivedStatus = r.status;
      if (r.status === "confirmed" && remainingMinutes === 0) {
        derivedStatus = "expired";
      }

      return {
        ...r,
        remainingMinutes,
        derivedStatus,
        // Map API fields to display fields
        stationName: r.station?.name || "Unknown Station",
        stationAddress: r.station?.address || "",
        batteryType: "Standard", // Battery type info not in response
        reservedAt: new Date(r.reservation_at),
        estimatedArrival: new Date(r.expiration_at),
      };
    });
  }, [reservations, now]);

  const activeReservations = reservationsAugmented.filter(
    (r) => r.status === "confirmed" || r.status === "pending"
  );
  const historyReservations = reservationsAugmented.filter(
    (r) => r.status !== "confirmed" && r.status !== "pending"
  );

  const handleCancelReservation = async (reservationId: string) => {
    Alert.alert(t("reservation.cancelTitle"), t("reservation.cancelMessage"), [
      { text: t("reservation.cancelNo"), style: "cancel" },
      {
        text: t("reservation.cancelConfirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await ReservationService.cancelReservation(reservationId);
            Alert.alert(
              t("reservation.cancelSuccessTitle"),
              t("reservation.cancelSuccessMessage")
            );
            loadReservations(); // Reload list
          } catch (error) {
            console.error("Error cancelling reservation:", error);
            Alert.alert("Lỗi", "Không thể hủy đặt chỗ");
          }
        },
      },
    ]);
  };

  const handleOpenDirections = (reservation: any) => {
    const { station } = reservation;

    console.log("🗺️ Opening directions for reservation:", {
      reservationId: reservation.id,
      hasStation: !!station,
      station: station,
      stationLat: station?.latitude || station?.lat,
      stationLng: station?.longitude || station?.lng,
    });

    if (!station) {
      Alert.alert("Lỗi", "Không có thông tin trạm. Vui lòng thử lại sau.");
      return;
    }

    // Support both latitude/longitude and lat/lng field names
    const lat = parseFloat(station.latitude || station.lat);
    const lng = parseFloat(station.longitude || station.lng);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      Alert.alert("Lỗi", "Không có thông tin vị trí trạm");
      console.error("Invalid coordinates:", { lat, lng, station });
      return;
    }

    const label = encodeURIComponent(station.name || "Trạm đổi pin");

    // Google Maps URL scheme
    const url = Platform.select({
      ios: `comgooglemaps://?q=${lat},${lng}&center=${lat},${lng}&zoom=15`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });

    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            // Fallback to web browser
            return Linking.openURL(fallbackUrl);
          }
        })
        .catch(() => {
          // Fallback if anything goes wrong
          Linking.openURL(fallbackUrl);
        });
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: {
      label: t("status.pending", { defaultValue: "Đang chờ" }),
      color: "#f59e0b",
    },
    confirmed: { label: t("status.active"), color: styleTokens.colors.success },
    completed: {
      label: t("status.completed"),
      color: styleTokens.colors.primary,
    },
    expired: { label: t("status.expired"), color: "#f59e0b" },
    cancelled: {
      label: t("status.cancelled"),
      color: styleTokens.colors.danger,
    },
  };

  const renderCard = useCallback(
    (
      item: Reservation & {
        remainingMinutes: number;
        derivedStatus: string;
        stationName: string;
        stationAddress: string;
        batteryType: string;
        reservedAt: Date;
        estimatedArrival: Date;
      }
    ) => {
      const cfg = statusConfig[item.derivedStatus] || statusConfig[item.status];
      const showCountdown = item.status === "confirmed";

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
              <Text style={styles.metaLabel}>
                {t("reservation.batteryTypeLabel")}
              </Text>
              <Text style={styles.metaValue}>Pin {item.batteryType}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>
                {t("reservation.bookedAtLabel")}
              </Text>
              <Text style={styles.metaValueSmall}>
                {item.reservedAt.toLocaleString(
                  i18n.language.startsWith("vi") ? "vi-VN" : "en-US"
                )}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{t("reservation.etaLabel")}</Text>
              <Text style={styles.metaValueSmall}>
                {item.estimatedArrival.toLocaleTimeString(
                  i18n.language.startsWith("vi") ? "vi-VN" : "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
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
                  <Text style={[styles.countdownLabel]}>
                    {t("time.remaining")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.countdownValue,
                    { color: countdownVisual.accent },
                  ]}
                >
                  {item.remainingMinutes}
                  <Text style={styles.countdownValueUnit}>
                    {" "}
                    {t("time.minutes")}
                  </Text>
                </Text>
              </View>
            )}
            {showCountdown && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => handleCancelReservation(item.id)}
                >
                  <Text style={styles.actionBtnText}>
                    {t("reservation.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.directionsBtn]}
                  onPress={() => handleOpenDirections(item)}
                >
                  <Text style={styles.directionsBtnText}>
                    {t("reservation.navigate")}
                  </Text>
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={styleTokens.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("reservations.title")}</Text>
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
            {t("status.active")} ({activeReservations.length})
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
            {t("history.title", { defaultValue: "Lịch sử" })} (
            {historyReservations.length})
          </Text>
        </TouchableOpacity>
      </View>

      {dataToRender.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>{t("reservations.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>
            {t("reservations.emptySubtitle")}
          </Text>
          <Button
            title={t("cta.findStation")}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  directionsBtn: {
    backgroundColor: "#5D7B6F",
  },
  directionsBtnText: {
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
    backgroundColor: "#5D7B6F",
    borderColor: "#5D7B6F",
  },
});
