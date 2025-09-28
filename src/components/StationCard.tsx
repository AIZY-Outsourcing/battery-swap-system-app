import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Station } from "../types/station";
import { styleTokens } from "../styles/tokens";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const getStatusColor = () => {
    if (station.available > 0) return styleTokens.colors.success;
    if (station.maintenance > 0) return styleTokens.colors.danger;
    return styleTokens.colors.muted;
  };

  const getStatusText = () => {
    if (station.available > 0) {
      return t("station.status.available", {
        available: station.available,
        capacity: station.capacity,
      });
    }
    if (station.maintenance > 0) {
      return t("station.status.maintenance");
    }
    return t("station.status.empty");
  };

  const getTypeText = () => {
    switch (station.type) {
      case "station":
        return t("station.type.public");
      case "dealer":
        return t("station.type.dealer");
      case "service":
        return t("station.type.service");
      default:
        return t("station.type.other");
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
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            gap: 6,
          }}
        >
          <MaterialCommunityIcons
            name={
              station.type === "station"
                ? "battery-charging-medium"
                : station.type === "dealer"
                ? "store-outline"
                : "wrench-outline"
            }
            size={16}
            color={styleTokens.colors.textDark}
          />
          <Text style={styles.typeText}>{getTypeText()}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color={styleTokens.colors.success}
          />
          <Text style={styles.hours}>
            {t("station.open")}: {station.openHours}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: styleTokens.spacing.lg,
        }}
      >
        <MaterialCommunityIcons
          name="battery"
          size={16}
          color={getStatusColor()}
        />
        <Text
          style={[styles.status, { color: getStatusColor(), marginBottom: 0 }]}
        >
          {getStatusText()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleDirections}
        >
          <Text style={styles.primaryButtonText}>
            {t("station.directions")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleGoogleMaps}
        >
          <Text style={styles.secondaryButtonText}>
            {t("station.googleMap")}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: styleTokens.colors.white,
    padding: styleTokens.padding,
    marginHorizontal: styleTokens.padding,
    marginVertical: styleTokens.spacing.xs,
    borderRadius: styleTokens.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardSelected: {
    borderColor: styleTokens.colors.primaryAccent || styleTokens.colors.primary,
    backgroundColor: styleTokens.colors.white,
    borderWidth: 2,
    shadowOpacity: 0.15,
    elevation: 5,
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
    color: styleTokens.colors.textDark,
  },
  distance: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.primaryAccent || styleTokens.colors.primary,
  },
  rating: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: styleTokens.spacing.sm,
    paddingVertical: styleTokens.spacing.xs,
    borderRadius: 12,
  },
  ratingText: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.textDark,
  },
  address: {
    ...styleTokens.typography.subtitle,
    marginBottom: styleTokens.spacing.sm,
    color: styleTokens.colors.textMuted,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: styleTokens.spacing.sm,
  },
  typeText: {
    ...styleTokens.typography.small,
    flex: 1,
    color: styleTokens.colors.textMuted,
  },
  hours: {
    ...styleTokens.typography.small,
    color: styleTokens.colors.success,
  },
  status: {
    ...styleTokens.typography.body,
    fontWeight: "500",
    marginBottom: styleTokens.spacing.lg,
    color: styleTokens.colors.textDark,
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
    backgroundColor:
      styleTokens.colors.primaryAccent || styleTokens.colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: styleTokens.colors.primaryAccent || styleTokens.colors.primary,
  },
  primaryButtonText: {
    color: styleTokens.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: styleTokens.colors.primaryAccent || styleTokens.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
