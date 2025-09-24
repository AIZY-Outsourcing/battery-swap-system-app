import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function KioskSessionScreen() {
  const [sessionStatus, setSessionStatus] = useState<
    "ready" | "scanning" | "connected" | "swapping" | "complete"
  >("ready");
  const [batteryLevel, setBatteryLevel] = useState(15);
  const [swapProgress, setSwapProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionStatus === "swapping") {
      interval = setInterval(() => {
        setSwapProgress((prev) => {
          if (prev >= 100) {
            setSessionStatus("complete");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStatus]);

  const handleStartSession = () => {
    setSessionStatus("scanning");
    // Simulate QR scan success after 2 seconds
    setTimeout(() => {
      setSessionStatus("connected");
    }, 2000);
  };

  const handleStartSwap = () => {
    setSessionStatus("swapping");
    setSwapProgress(0);
  };

  const handleEndSession = () => {
    Alert.alert(
      "Session Complete",
      "Your battery has been successfully swapped! You can now continue your journey.",
      [{ text: "OK", onPress: () => setSessionStatus("ready") }]
    );
  };

  const renderContent = () => {
    switch (sessionStatus) {
      case "ready":
        return (
          <View style={styles.centerContent}>
            <Text style={styles.title}>Start Kiosk Session</Text>
            <Text style={styles.subtitle}>
              Position your vehicle at the station and tap below to begin
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartSession}
            >
              <Text style={styles.primaryButtonText}>Scan QR Code</Text>
            </TouchableOpacity>
          </View>
        );

      case "scanning":
        return (
          <View style={styles.centerContent}>
            <View style={styles.scanningAnimation}>
              <Text style={styles.scanningText}>📱</Text>
            </View>
            <Text style={styles.title}>Scanning QR Code</Text>
            <Text style={styles.subtitle}>
              Point your camera at the kiosk QR code
            </Text>
          </View>
        );

      case "connected":
        return (
          <View style={styles.centerContent}>
            <Text style={styles.title}>Connected to Station</Text>
            <Text style={styles.subtitle}>Downtown Station - Bay 2</Text>

            <View style={styles.batteryStatus}>
              <Text style={styles.batteryTitle}>Current Battery</Text>
              <View style={styles.batteryContainer}>
                <View style={styles.batteryOutline}>
                  <View
                    style={[styles.batteryFill, { width: `${batteryLevel}%` }]}
                  />
                </View>
                <Text style={styles.batteryText}>{batteryLevel}%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartSwap}
            >
              <Text style={styles.primaryButtonText}>Start Battery Swap</Text>
            </TouchableOpacity>
          </View>
        );

      case "swapping":
        return (
          <View style={styles.centerContent}>
            <Text style={styles.title}>Battery Swap in Progress</Text>
            <Text style={styles.subtitle}>
              Please wait while we swap your battery
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${swapProgress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(swapProgress)}%
              </Text>
            </View>

            <Text style={styles.warningText}>
              ⚠️ Do not move your vehicle during the swap process
            </Text>
          </View>
        );

      case "complete":
        return (
          <View style={styles.centerContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.title}>Swap Complete!</Text>
            <Text style={styles.subtitle}>
              Your battery has been successfully swapped
            </Text>

            <View style={styles.newBatteryStatus}>
              <Text style={styles.batteryTitle}>New Battery</Text>
              <View style={styles.batteryContainer}>
                <View style={styles.batteryOutline}>
                  <View
                    style={[
                      styles.batteryFill,
                      { width: "95%", backgroundColor: "#4CAF50" },
                    ]}
                  />
                </View>
                <Text style={styles.batteryText}>95%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleEndSession}
            >
              <Text style={styles.primaryButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  scanningAnimation: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#007AFF",
    marginBottom: 20,
  },
  scanningText: {
    fontSize: 40,
  },
  batteryStatus: {
    alignItems: "center",
    marginBottom: 40,
  },
  newBatteryStatus: {
    alignItems: "center",
    marginBottom: 40,
  },
  batteryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  batteryOutline: {
    width: 120,
    height: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  batteryFill: {
    height: "100%",
    backgroundColor: "#FF9800",
  },
  batteryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  progressBar: {
    width: width - 80,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  warningText: {
    fontSize: 14,
    color: "#FF9800",
    textAlign: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
});
