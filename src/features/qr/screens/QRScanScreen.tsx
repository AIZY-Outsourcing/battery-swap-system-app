import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";

interface QRScanScreenProps {
  navigation: any;
  route: any;
}

export default function QRScanScreen({ navigation, route }: QRScanScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Simulate camera permission request
    setHasPermission(true);
  }, []);

  const handleScanPress = () => {
    // Simulate QR scan - replace with actual camera/barcode scanner
    const mockQRData = "BSS_KIOSK_12345";

    Vibration.vibrate(100);
    const kioskId = mockQRData
      .replace("BSS_KIOSK_", "")
      .replace("BSS_STATION_", "");

    navigation.navigate("SwapSession", {
      kioskId,
      stationId: route.params?.stationId || null,
    });
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          {/* Loading state - you can add a loading indicator here */}
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    Alert.alert(
      "Không có quyền truy cập camera",
      "Ứng dụng cần quyền truy cập camera để quét QR code.",
      [
        { text: "Quay lại", onPress: () => navigation.goBack() },
        {
          text: "Cài đặt",
          onPress: () => {
            /* Open app settings */
          },
        },
      ]
    );
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Simulated Camera View */}
      <View style={styles.scanner}>
        <View style={styles.mockCamera}>
          <Text style={styles.mockCameraText}>Camera View</Text>
          <Text style={styles.mockCameraSubtext}>
            (QR Scanner sẽ hoạt động khi cài đặt expo-camera)
          </Text>
        </View>
      </View>

      {/* Scanner overlay */}
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

          {/* Mock Scan Button for testing */}
          <TouchableOpacity
            style={styles.mockScanButton}
            onPress={handleScanPress}
          >
            <Text style={styles.mockScanButtonText}>
              Mô phỏng quét QR (Test)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scanner: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    bottom: 100,
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

  // Mock camera styles
  mockCamera: {
    flex: 1,
    backgroundColor: theme.colors.surface.elevated,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  mockCameraText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  mockCameraSubtext: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 8,
    textAlign: "center",
  },
  mockScanButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  mockScanButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
