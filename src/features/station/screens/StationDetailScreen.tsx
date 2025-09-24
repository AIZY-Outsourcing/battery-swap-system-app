import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";
import { getStationById } from "../../../services/api/StationService";
import ReserveModal from "../components/ReserveModal";
import { track } from "../../../services/analytics";

export default function StationDetailScreen({ route, navigation }: any) {
  const { stationId } = route.params as { stationId: string | number };
  const [station, setStation] = useState<any | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await getStationById(stationId);
        if (mounted) {
          setStation(s);
          track({ name: "station_view", stationId });
          setError(null);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Không thể tải thông tin trạm");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [stationId]);

  const handleDirections = () => {
    if (!station) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    Linking.openURL(url);
    track({ name: "station_directions", stationId });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={styles.stationImage} />
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {station?.available && station.available > 0
                ? "Hoạt động"
                : "Hết pin"}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[styles.stationName, { color: theme.colors.text.primary }]}
          >
            {loading ? "Đang tải..." : station?.name || "Không có tên"}
          </Text>
          {!!station?.address && (
            <Text
              style={[styles.address, { color: theme.colors.text.secondary }]}
            >
              📍 {station.address}
            </Text>
          )}

          {error ? (
            <Text
              style={[styles.address, { color: theme.colors.text.secondary }]}
            >
              {error}
            </Text>
          ) : (
            <View style={styles.batteryContainer}>
              <View style={styles.batteryStatus}>
                <Text
                  style={[styles.batteryCount, { color: theme.colors.success }]}
                >
                  {station?.available ?? 0}
                </Text>
                <Text
                  style={[
                    styles.batteryLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Pin sẵn sàng
                </Text>
              </View>
              <View style={styles.batteryStatus}>
                <Text
                  style={[
                    styles.batteryCount,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {station?.capacity ?? 0}
                </Text>
                <Text
                  style={[
                    styles.batteryLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Tổng pin
                </Text>
              </View>
              <View style={styles.batteryStatus}>
                <Text
                  style={[
                    styles.batteryCount,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {station?.openHours || ""}
                </Text>
                <Text
                  style={[
                    styles.batteryLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Giờ hoạt động
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                setReserveOpen(true);
                track({ name: "station_reserve_open", stationId });
              }}
            >
              <Text style={styles.primaryButtonText}>Đặt pin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.outlineButton,
                { borderColor: theme.colors.primary },
              ]}
              onPress={handleDirections}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  { color: theme.colors.primary },
                ]}
              >
                Chỉ đường
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.outlineButton,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => {
                navigation.getParent()?.navigate("QRScan");
                track({ name: "station_qr_open", stationId });
              }}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  { color: theme.colors.primary },
                ]}
              >
                Quét QR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {station && (
        <ReserveModal
          visible={reserveOpen}
          stationName={station.name}
          stationId={String(station.id)}
          onClose={() => setReserveOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: "relative" },
  stationImage: { width: "100%", height: 200, backgroundColor: "#e9eef5" },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#28c76f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  infoContainer: { padding: 20 },
  stationName: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  address: { fontSize: 16, marginBottom: 24 },
  batteryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  batteryStatus: { alignItems: "center" },
  batteryCount: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  batteryLabel: { fontSize: 12, textAlign: "center" },
  actionContainer: { gap: 12 },
  actionButton: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  outlineButton: { backgroundColor: "transparent", borderWidth: 2 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  outlineButtonText: { fontSize: 16, fontWeight: "600" },
});
