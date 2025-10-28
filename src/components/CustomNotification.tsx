import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface NotificationData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface CustomNotificationProps {
  notification: NotificationData | null;
  onHide: () => void;
}

const { width } = Dimensions.get("window");

export default function CustomNotification({ notification, onHide }: CustomNotificationProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notification) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!notification) return null;

  const getIconName = () => {
    switch (notification.type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert";
      case "info":
        return "information";
      default:
        return "information";
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case "success":
        return "#34c759";
      case "error":
        return "#ff3b30";
      case "warning":
        return "#ff9500";
      case "info":
        return "#007aff";
      default:
        return "#007aff";
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "success":
        return "#e8f5e8";
      case "error":
        return "#ffe6e6";
      case "warning":
        return "#fff3e0";
      case "info":
        return "#e6f3ff";
      default:
        return "#e6f3ff";
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "success":
        return "#34c759";
      case "error":
        return "#ff3b30";
      case "warning":
        return "#ff9500";
      case "info":
        return "#007aff";
      default:
        return "#007aff";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hideNotification}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getIconName()}
            size={24}
            color={getIconColor()}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          {notification.message && (
            <Text style={styles.message}>{notification.message}</Text>
          )}
        </View>

        <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
