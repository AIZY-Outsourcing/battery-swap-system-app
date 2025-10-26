import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OverlayScanner = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.unfocusedContainer}>
        <View style={styles.middleContainer}>
          <View style={styles.focusedContainer}>
            <View style={styles.scanFrame}>
              {/* Corner borders */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Đưa QR code vào khung để quét
        </Text>
        <Text style={styles.subInstructionsText}>
          QR code nằm trên màn hình kiosk tại trạm
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  middleContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 200,
    height: 200,
    position: "relative",
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#5D7B6F",
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  instructionsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subInstructionsText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
});

export default OverlayScanner;

