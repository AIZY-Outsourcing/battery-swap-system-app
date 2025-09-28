import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { MainTabParamList } from "./types";
import HomeScreen from "../features/station/screens/HomeScreen";
import MyReservationsScreen from "../features/reservation/screens/MyReservationsScreen";
import QRScanScreen from "../features/qr/screens/QRScanScreen";
import HistoryScreen from "../features/history/screens/HistoryScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // Colors & sizes are managed by the custom tab bar
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* 1. Home (Stations) - Entry point, bên trái */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("tab.home"),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>🏠</Text>
          ),
        }}
      />

      {/* 2. Reservations - Quản lý pin đã đặt */}
      <Tab.Screen
        name="MyReservations"
        component={MyReservationsScreen}
        options={{
          tabBarLabel: t("tab.reservations"),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>📑</Text>
          ),
        }}
      />

      {/* 3. Scan QR - CENTER TAB - Action chính */}
      <Tab.Screen
        name="QRScan"
        component={QRScanScreen}
        options={{
          tabBarLabel: t("tab.scan"),
          tabBarIcon: ({ color, size, focused }) => (
            <Text
              style={{
                fontSize: focused ? size + 2 : size - 2,
                color: focused ? "#FF6B35" : color,
              }}
            >
              🎯
            </Text>
          ),
          tabBarActiveTintColor: "#5D7B6F", // Màu nổi bật cho center tab
        }}
      />

      {/* 4. History - Swap & Payment History */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t("tab.history"),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>🕒</Text>
          ),
        }}
      />

      {/* 5. Profile - Account, Settings, Support */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t("tab.profile"),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
