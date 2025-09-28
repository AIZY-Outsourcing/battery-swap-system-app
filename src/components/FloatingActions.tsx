import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MapViewMode } from "../types/station";
import { styleTokens } from "../styles/tokens";

interface FloatingActionsProps {
  onLayerToggle: () => void;
  // onScooterMode: () => void;
  onMyLocation: () => void;
  mapMode: MapViewMode;
}

export default function FloatingActions({
  onLayerToggle,
  // onScooterMode,
  onMyLocation,
  mapMode,
}: FloatingActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, mapMode !== "standard" && styles.buttonActive]}
        onPress={onLayerToggle}
        accessibilityLabel="Toggle map layers"
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={
            mapMode === "standard" ? "layers-triple-outline" : "layers-triple"
          }
          size={22}
          color={
            mapMode !== "standard"
              ? styleTokens.colors.white
              : styleTokens.colors.muted
          }
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.button}
        onPress={onScooterMode}
        accessibilityLabel="Scooter view"
      >
        <Text style={styles.icon}>🛵</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.button}
        onPress={onMyLocation}
        accessibilityLabel="My location"
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={22}
          color={styleTokens.colors.muted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: styleTokens.padding,
    top: "8%", // moved up for closer placement
    zIndex: 1000,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: styleTokens.spacing.sm,
    ...styleTokens.shadow,
  },
  buttonActive: {
    backgroundColor: styleTokens.colors.primary,
  },
  icon: {
    fontSize: 18,
  },
});
