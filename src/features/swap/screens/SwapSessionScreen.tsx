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

interface SwapSessionScreenProps {
  navigation: any;
}

export const SwapSessionScreen: React.FC<SwapSessionScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [isSwapping, setIsSwapping] = useState(false);

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

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.progressText}>
          Bước {currentStep + 1} / {swapSteps.length}
        </Text>
      </View>

      {/* Current Step */}
      <View style={styles.stepContainer}>
        <View style={styles.stepIconContainer}>
          <MaterialCommunityIcons
            name="battery-charging-medium"
            size={64}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

        {/* Loading indicator */}
        {isSwapping && (
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: progressAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                  }),
                },
              ]}
            />
            <Text style={styles.loadingText}>
              {currentStep === swapSteps.length - 1
                ? "Hoàn thành!"
                : "Đang xử lý..."}
            </Text>
          </View>
        )}
      </View>

      {/* Station Info */}
      <View style={styles.stationInfo}>
        <Text style={styles.stationLabel}>Trạm đổi pin</Text>
        <Text style={styles.stationName}>Vincom Bà Triệu</Text>
        <Text style={styles.stationAddress}>
          191 Bà Triệu, Hai Bà Trưng, Hà Nội
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!isSwapping ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSwap}
          >
            <Text style={styles.startButtonText}>Bắt đầu đổi pin</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSwap}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
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
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.default,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
  },
  stepContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  stepIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface.elevated,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: "500",
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
  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  stepsList: {
    flex: 1,
    paddingHorizontal: 16,
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
