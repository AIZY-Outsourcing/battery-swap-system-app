import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from "../../../theme";
import StationSessionService from "../../../services/api/StationSessionService";

interface SwapSessionScreenProps {
  navigation: any;
  route: {
    params: {
      sessionData?: {
        id: string;
        session_token: string;
        station_id: string;
        user_id: string;
        status: string;
        expires_at: string;
        station?: {
          id: string;
          name: string;
          address: string;
          city: string;
          lat: string;
          lng: string;
          status: string;
        };
      };
      kioskId?: string;
      stationId?: string;
    };
  };
}

export const SwapSessionScreen: React.FC<SwapSessionScreenProps> = ({
  navigation,
  route,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [isSwapping, setIsSwapping] = useState(false);

  // Debug log to check station data
  console.log("SwapSessionScreen - sessionData:", route.params?.sessionData);
  console.log("SwapSessionScreen - station:", route.params?.sessionData?.station);

  const swapSteps = [
    {
      id: 0,
      title: "Chuẩn bị đổi pin",
      subtitle: "Đang kiểm tra trạm và pin cũ",
      icon: "search",
    },
    {
      id: 1,
      title: "Tháo pin cũ",
      subtitle: "Vui lòng tháo pin cũ ra khỏi xe",
      icon: "battery-outline",
    },
    {
      id: 2,
      title: "Đặt pin cũ vào khoang",
      subtitle: "Đặt pin cũ vào khoang trống",
      icon: "arrow-down",
    },
    {
      id: 3,
      title: "Lấy pin mới",
      subtitle: "Pin mới đã sẵn sàng, vui lòng lấy ra",
      icon: "battery",
    },
    {
      id: 4,
      title: "Lắp pin mới",
      subtitle: "Lắp pin mới vào xe và khởi động",
      icon: "checkmark-circle",
    },
  ];

  useEffect(() => {
    // Simulate swap process
    if (isSwapping) {
      const timer = setTimeout(() => {
        if (currentStep < swapSteps.length - 1) {
          setCurrentStep(currentStep + 1);
          // Animate progress
          Animated.timing(progressAnimation, {
            toValue: (currentStep + 1) / (swapSteps.length - 1),
            duration: 500,
            useNativeDriver: false,
          }).start();
        } else {
          // Swap completed
          setTimeout(() => {
            navigation.navigate("SwapSuccess");
          }, 1000);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isSwapping, progressAnimation, navigation]);

  const handleStartSwap = () => {
    setIsSwapping(true);
    setCurrentStep(0);
    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const handleCancelSwap = () => {
    Alert.alert("Hủy đổi pin", "Bạn có chắc muốn hủy quá trình đổi pin?", [
      { text: "Tiếp tục", style: "cancel" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleEndSession = async () => {
    if (!route.params?.sessionData?.id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin phiên làm việc");
      return;
    }

    Alert.alert(
      "Kết thúc phiên",
      "Bạn có chắc muốn kết thúc phiên làm việc tại trạm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Kết thúc",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await StationSessionService.endSession(
                route.params.sessionData!.id,
                route.params.sessionData!.session_token
              );
              
              console.log("End session response:", JSON.stringify(result, null, 2));
              
              // Check if end session was successful
              const isSuccess = (result.data as any)?.success === true || result.success;
              
              if (isSuccess) {
                Alert.alert(
                  "Thành công",
                  "Đã kết thúc phiên làm việc",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.navigate("MainTabs"),
                    },
                  ]
                );
              } else {
                // Check if session was already ended (e.g., at kiosk)
                const errorMessage = result.error?.message || "Không thể kết thúc phiên";
                if (errorMessage.includes("already ended") || errorMessage.includes("not found") || errorMessage.includes("inactive")) {
                  Alert.alert(
                    "Phiên đã kết thúc",
                    "Phiên làm việc đã được kết thúc tại kiosk. Bạn sẽ được chuyển về trang chủ.",
                    [
                      {
                        text: "OK",
                        onPress: () => navigation.navigate("MainTabs"),
                      },
                    ]
                  );
                } else {
                  Alert.alert("Lỗi", errorMessage);
                }
              }
            } catch (error: any) {
              Alert.alert("Lỗi", error.message || "Có lỗi xảy ra");
            }
          },
        },
      ]
    );
  };

  const currentStepData = swapSteps[currentStep];
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancelSwap}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi pin</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Success Message */}
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmarkIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Đăng nhập thành công!</Text>
        <Text style={styles.successSubtitle}>
          Đang đổi pin tại trạm {route.params?.sessionData?.station?.name || "Station fallback name"}
        </Text>
      </View>

      {/* Station Info */}
      <View style={styles.stationInfo}>
        <Text style={styles.stationLabel}>Trạm đổi pin</Text>
        <Text style={styles.stationName}>
          {route.params?.sessionData?.station?.name || "Station fallback name"}
        </Text>
        <Text style={styles.stationAddress}>
          {route.params?.sessionData?.station?.address || "Station fallback address"}
        </Text>
        <Text style={styles.stationCity}>
          {route.params?.sessionData?.station?.city || "Station fallback city"}
        </Text>
      </View>

      {/* Steps List */}
      <View style={styles.stepsList}>
        {swapSteps.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepNumber,
                index <= currentStep && styles.stepNumberActive,
                index < currentStep && styles.stepNumberCompleted,
              ]}
            >
              {index < currentStep ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.stepNumberText,
                    index <= currentStep && styles.stepNumberTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= currentStep && styles.stepLabelActive,
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>
      
      {/* End Session Button - Fixed at bottom */}
      {route.params?.sessionData && (
        <View style={styles.endSessionContainer}>
          <TouchableOpacity
            style={styles.endSessionButton}
            onPress={handleEndSession}
          >
            <Text style={styles.endSessionButtonText}>Kết thúc phiên</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  successContainer: {
    backgroundColor: theme.colors.success,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmarkIcon: {
    fontSize: 24,
    color: theme.colors.success,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  stationInfo: {
    backgroundColor: theme.colors.surface.elevated,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  stationLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  stationCity: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  endSessionButton: {
    backgroundColor: theme.colors.warning,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  endSessionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  endSessionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  stepsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.border.default,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberActive: {
    backgroundColor: theme.colors.primary,
  },
  stepNumberCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },
  stepNumberTextActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  stepLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: "500",
  },

  // New icon styles
  closeIcon: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  stepIcon: {
    fontSize: 40,
    textAlign: "center",
  },
  checkmark: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "bold",
  },
});
