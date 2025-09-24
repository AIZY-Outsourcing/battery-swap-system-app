import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Station } from "../types/station";
import { styleTokens } from "../styles/tokens";
import { formatDistance } from "../utils/geo";

interface StationCardProps {
  station: Station;
  isSelected?: boolean;
  onPress?: () => void;
  onDirections?: () => void;
}

export default function StationCard({
  station,
  isSelected = false,
  onPress,
  onDirections,
}: StationCardProps) {
  const getStatusColor = () => {
    if (station.available > 0) return styleTokens.colors.success;
    if (station.maintenance > 0) return styleTokens.colors.danger;
    return styleTokens.colors.muted;
  };

  const getStatusText = () => {
    if (station.available > 0) {
      return `Còn sạc sẵn sàng: ${station.available}/${station.capacity}`;
    }
    if (station.maintenance > 0) {
      return "Bảo trì";
    }
    return "Hết pin";
  };

  const getTypeText = () => {
    switch (station.type) {
      case "station":
        return "Trạm công cộng - Gửi xe miễn phí";
      case "dealer":
        return "Đại lý - Gửi xe tính phí";
      case "service":
        return "Xưởng dịch vụ - Sửa chữa";
      default:
        return "Khác";
    }
  };

  const handleDirections = () => {
    const url = `google.navigation:q=${station.lat},${station.lng}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to web Google Maps
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{station.name}</Text>
          {station.distanceKm && (
            <Text style={styles.distance}>
              {formatDistance(station.distanceKm)}
            </Text>
          )}
        </View>
        {station.rating && (
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {station.rating}</Text>
          </View>
        )}
      </View>

      <Text style={styles.address}>{station.address}</Text>

      <View style={styles.info}>
        <Text style={styles.typeText}>
          {station.type === "station"
            ? "🔋"
            : station.type === "dealer"
            ? "🏪"
            : "🔧"}{" "}
          {getTypeText()}
        </Text>
        <Text style={styles.hours}>Mở: {station.openHours}</Text>
      </View>

      <Text style={[styles.status, { color: getStatusColor() }]}>
        🔋 {getStatusText()}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleDirections}
        >
          <Text style={styles.primaryButtonText}>Chỉ đường</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleGoogleMaps}
        >
          <Text style={styles.secondaryButtonText}>Google Map</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: styleTokens.colors.card,
    padding: styleTokens.padding,
    marginHorizontal: styleTokens.padding,
    marginVertical: styleTokens.spacing.xs,
    borderRadius: styleTokens.radius,
    ...styleTokens.shadow,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: styleTokens.colors.primary,
    backgroundColor: styleTokens.colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: styleTokens.spacing.xs,
  },
  titleContainer: {
    flex: 1,
    marginRight: styleTokens.spacing.sm,
  },
  title: {
    ...styleTokens.typography.headline,
    marginBottom: 2,
  },
  distance: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.primary,
  },
  rating: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: styleTokens.spacing.sm,
    paddingVertical: styleTokens.spacing.xs,
    borderRadius: 12,
  },
  ratingText: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.white,
  },
  address: {
    ...styleTokens.typography.subtitle,
    marginBottom: styleTokens.spacing.sm,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: styleTokens.spacing.sm,
  },
  typeText: {
    ...styleTokens.typography.small,
    flex: 1,
  },
  hours: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.success,
  },
  status: {
    ...styleTokens.typography.body,
    fontWeight: "500",
    marginBottom: styleTokens.spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: styleTokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: styleTokens.spacing.md,
    paddingHorizontal: styleTokens.spacing.lg,
    borderRadius: styleTokens.radius,
    alignItems: "center",
    ...styleTokens.touchTarget,
  },
  primaryButton: {
    backgroundColor: styleTokens.colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: styleTokens.colors.primary,
  },
  primaryButtonText: {
    color: styleTokens.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: styleTokens.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
