import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { reserveStation } from "../../../services/api/StationService";
import { styleTokens } from "../../../styles/tokens";
import { track } from "../../../services/analytics";

type Props = {
  visible: boolean;
  stationName: string;
  stationId: number | string;
  vehicleId?: number | string; // optional for now
  onClose: () => void;
  onSuccess?: (reservation: {
    reservationId: string | number;
    reserved_at: string;
    expired_at: string;
  }) => void;
};

export default function ReserveModal({
  visible,
  stationName,
  stationId,
  vehicleId,
  onClose,
  onSuccess,
}: Props) {
  const options = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i + 1) * 5),
    []
  ); // 5..60
  const [eta, setEta] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await reserveStation(stationId, {
        vehicle_id: vehicleId ?? 0,
        eta_minutes: eta,
      });
      onSuccess?.(res);
      onClose();
      const from = new Date(res.reserved_at);
      const to = new Date(res.expired_at);
      Alert.alert(
        "Đặt pin thành công",
        `Giữ chỗ từ ${from.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} đến ${to.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      track({
        name: "station_reserve_success",
        stationId,
        reservationId: res.reservationId,
      });
    } catch (e: any) {
      Alert.alert(
        "Trạm hiện không có pin đầy",
        e?.message || "Vui lòng thử lại sau"
      );
      track({ name: "station_reserve_fail", stationId, error: e?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Đặt pin tại {stationName}</Text>
          <Text style={styles.caption}>Thời gian giữ mặc định 30 phút</Text>

          <View style={styles.etaRow}>
            {options.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, eta === m && styles.chipActive]}
                onPress={() => setEta(m)}
                accessibilityRole="button"
                accessibilityLabel={`Chọn ${m} phút`}
              >
                <Text
                  style={[styles.chipText, eta === m && styles.chipTextActive]}
                >
                  {m}p
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancel]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.primary]}
              onPress={handleConfirm}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Xác nhận đặt pin"
            >
              <Text style={styles.primaryText}>
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: styleTokens.colors.card,
    padding: styleTokens.padding,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { ...styleTokens.typography.headline },
  caption: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.muted,
    marginBottom: styleTokens.spacing.md,
  },
  etaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: styleTokens.spacing.lg,
  },
  chip: {
    borderWidth: 1,
    borderColor: styleTokens.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipActive: { backgroundColor: styleTokens.colors.primary },
  chipText: { color: styleTokens.colors.primary, fontWeight: "600" },
  chipTextActive: { color: styleTokens.colors.white },
  actions: { flexDirection: "row", gap: styleTokens.spacing.sm },
  btn: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 8 },
  cancel: { borderWidth: 1, borderColor: styleTokens.colors.muted },
  cancelText: { color: styleTokens.colors.muted, fontWeight: "600" },
  primary: { backgroundColor: styleTokens.colors.primary },
  primaryText: { color: styleTokens.colors.white, fontWeight: "700" },
});
