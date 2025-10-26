import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Vibration,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/ui/Button";
import OverlayScanner from "../../../components/custom/OverlayScanner/OverlayScanner";
import { useCamera } from "../../../hooks/useCamera";
import StationSessionService from "../../../services/api/StationSessionService";

interface QRScanScreenProps {
  navigation: any;
  route: any;
}

export default function QRScanScreen({ navigation, route }: QRScanScreenProps) {
  const { permission, requestPermission, isCameraAvailable } =
    useCamera("qr-scanner-screen");
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorCard, setShowErrorCard] = useState(false);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const hasScannedRef = useRef(false);
  const apiCalledRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (cameraRef.current) {
      setScanned(false);
      setIsProcessing(false);
      setShowErrorCard(false);
      hasScannedRef.current = false;
      apiCalledRef.current = false;
      isProcessingRef.current = false;
      // Thêm delay nhỏ để đảm bảo cleanup hoàn tất
      setTimeout(() => {
        cameraRef.current = null;
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setIsProcessing(false);
      setShowErrorCard(false);
      hasScannedRef.current = false;
      apiCalledRef.current = false;
      isProcessingRef.current = false;
    } else {
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [isFocused, cleanup]);

  const handleBarCodeScanned = useCallback(
    async ({ type, data }: any) => {
      // Strict check - if already scanned or processing, return immediately
      if (
        !isCameraAvailable ||
        scanned ||
        isProcessing ||
        hasScannedRef.current ||
        apiCalledRef.current ||
        isProcessingRef.current
      ) {
        console.log(
          "QR scan blocked - already scanned, processing, or API called"
        );
        return;
      }

      console.log("QR detected, starting processing...");

      // Immediately set ALL flags to prevent any further scanning
      hasScannedRef.current = true;
      apiCalledRef.current = true;
      isProcessingRef.current = true;
      setScanned(true);
      setIsProcessing(true);
      Vibration.vibrate(100);

      console.log(`Scanned: ${type}, ${data}`);

      try {
        // Extract session token from QR data
        let sessionToken = data;
        let kioskId = "";
        let stationId = route.params?.stationId || null;

        // Check for QR data prefix and extract token
        if (data.startsWith("qr_data=")) {
          // New format: "qr_data eyJpdiI6Ijc5ZTNiMmVmYmRmMjM2YzAyM2U4ODM1ODNiODRjNTY3IiwiYXV0aFRhZyI6IjBiYWIwNmNiNTM5ZThmMmJiZTY1ODNiYTBkMmU1MDU4IiwiZGF0YSI6ImVlYTMwY2VkMjc1OWM3Yjk1MWE2YzQ4NjZmOWYyZjQ1NDRlZDE0NjY1MGUzN2U5N2M4OTIwOWI3YThkNzJjYzFkNzdkYzhlY2QwODVhZTI2NmFkMGQ5MmY4MzE4MDZjOTg2Mzc1NmMzZTg0YTNmMWU0YzBlNzI2MjUwZTM2OWZiZmMwODVjMWY1YzE2MThkN2U1OWFjMTc1N2Y1MzA2ZDNhNjBjYjNkOWMyODUwZTk5MGJmZjRjODc2NmNhMzlmM2E2ODI0M2I4YTZlNzkwYzdkMmI0MGY2ZWNkYTliMDQ2MDAyNWNkOGNlYzg2YWI5YTJlNjUxZjhiZDU3NTIyMzgzZDk2MTM3ZGFhNWZjMzEwOGJiNDZmMjgyMDA4NTEwYTY5YTkwYTIyYmQ1YzcwODNiMDFkMzk2ZmJmNjcifQ=="
          sessionToken = data.replace("qr_data=", "");
        } else if (data.startsWith("BSS_SESSION_")) {
          // Legacy format: "BSS_SESSION_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          sessionToken = data.replace("BSS_SESSION_", "");
        } else if (data.startsWith("BSS_KIOSK_")) {
          // Legacy format - extract kiosk ID
          kioskId = data.replace("BSS_KIOSK_", "");
          sessionToken = `mock_session_${kioskId}`;
        } else if (data.startsWith("BSS_STATION_")) {
          // Legacy format - extract station ID
          stationId = data.replace("BSS_STATION_", "");
          sessionToken = `mock_session_${stationId}`;
        } else {
          // Unsupported QR format - show error card instead of alert
          setShowErrorCard(true);
          return;
        }

        // Try to authenticate with QR
        const authRes = await StationSessionService.authenticateQR({
          session_token: sessionToken,
        });

        console.log("Auth response:", JSON.stringify(authRes, null, 2));

        // Parse the response - authRes.data might be a JSON string
        let parsedData = authRes.data;
        if (typeof authRes.data === "string") {
          try {
            parsedData = JSON.parse(authRes.data);
          } catch (e) {
            console.error("Failed to parse authRes.data:", e);
          }
        }

        console.log("Parsed data:", parsedData);

        // Handle the actual response structure: { data: { success: true, data: {...} } }
        const sessionData = (parsedData as any)?.data;
        const isSuccess = (parsedData as any)?.success === true && sessionData;

        console.log("Session data:", sessionData);
        console.log("Is success:", isSuccess);

        if (isSuccess) {
          // Success! Navigate to SwapSession
          console.log("Navigating to SwapSession with data:", sessionData);
          navigation.navigate("SwapSession", {
            sessionData: sessionData,
            kioskId: sessionData.station_id,
            stationId: sessionData.station_id,
          });
        } else {
          console.log("Authentication failed, checking error...");
          // Authentication failed, check if it's a 2FA error
          if (
            authRes.error?.code === "QR_AUTH_FAILED" ||
            authRes.error?.code === "QR_AUTH_INVALID" ||
            authRes.error?.code === "QR_AUTH_2FA_REQUIRED"
          ) {
            // Navigate to PIN verification screen
            navigation.navigate("PinVerification", {
              sessionToken,
              kioskId: kioskId || sessionData?.station_id,
              stationId: stationId || sessionData?.station_id,
            });
          } else {
            Alert.alert(
              "Lỗi",
              authRes.error?.message || "Xác thực QR thất bại"
            );
            setScanned(false);
            setIsProcessing(false);
          }
        }
      } catch (error: any) {
        console.error("QR scan error:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý QR code");
        setScanned(false);
        setIsProcessing(false);
      }
    },
    [
      isCameraAvailable,
      scanned,
      isProcessing,
      navigation,
      route.params?.stationId,
    ]
  );

  if (permission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang khởi tạo camera...</Text>
        </View>
      </View>
    );
  }

  if (permission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.permissionText}>
            Chúng tôi cần quyền truy cập camera để quét QR code
          </Text>
          <Button
            title="Cấp quyền truy cập"
            onPress={requestPermission}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
    );
  }

  if (!permission || !isFocused) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang khởi tạo camera...</Text>
        </View>
      </View>
    );
  }

  const renderCamera = () => {
    if (!isFocused || !isCameraAvailable) return null;

    // Completely disable camera if already processed
    if (
      hasScannedRef.current ||
      apiCalledRef.current ||
      isProcessingRef.current
    ) {
      return (
        <View style={StyleSheet.absoluteFillObject}>
          <OverlayScanner />
        </View>
      );
    }

    return (
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={false}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <OverlayScanner />
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {renderCamera()}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Error Card */}
      {showErrorCard && (
        <View style={styles.errorCard}>
          <View style={styles.errorCardContent}>
            <View style={styles.errorIcon}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
            </View>
            <Text style={styles.errorText}>
              Mã không được hỗ trợ thanh toán
            </Text>
            <TouchableOpacity
              style={styles.errorCloseButton}
              onPress={() => {
                setShowErrorCard(false);
                setScanned(false);
                setIsProcessing(false);
                hasScannedRef.current = false;
                apiCalledRef.current = false;
                isProcessingRef.current = false;
              }}
            >
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(!isFocused || !isCameraAvailable) && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang khởi tạo camera...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  errorCard: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  errorCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  errorIcon: {
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  errorCloseButton: {
    padding: 4,
  },
});
