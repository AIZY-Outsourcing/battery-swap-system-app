import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MapViewMode } from "../types/station";
import { styleTokens } from "../styles/tokens";

interface FloatingActionsProps {
  onLayerToggle: () => void;
  onScooterMode: () => void;
  onMyLocation: () => void;
  mapMode: MapViewMode;
}

export default function FloatingActions({
  onLayerToggle,
  onScooterMode,
  onMyLocation,
  mapMode,
}: FloatingActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, mapMode !== "standard" && styles.buttonActive]}
        onPress={onLayerToggle}
        accessibilityLabel="Toggle map layers"
      >
        <Text style={styles.icon}>🗺️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onScooterMode}
        accessibilityLabel="Scooter view"
      >
        <Text style={styles.icon}>🛵</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onMyLocation}
        accessibilityLabel="My location"
      >
        <Text style={styles.icon}>📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: styleTokens.padding,
    top: "30%",
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
