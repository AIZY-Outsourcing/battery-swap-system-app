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

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
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
          tabBarLabel: "Trạm",
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
          tabBarLabel: "Đặt trước",
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
          tabBarLabel: "Quét QR",
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
          tabBarLabel: "Lịch sử",
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
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
