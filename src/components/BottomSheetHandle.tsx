import React from "react";
import { View, StyleSheet } from "react-native";
import { styleTokens } from "../styles/tokens";

export default function BottomSheetHandle() {
  return (
    <View style={styles.container}>
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: styleTokens.spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: styleTokens.colors.muted,
    borderRadius: 2,
  },
});
