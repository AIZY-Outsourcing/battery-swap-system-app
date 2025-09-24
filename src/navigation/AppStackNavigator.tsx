import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

// Import all screens
import MainNavigator from "./MainNavigator";
// Station screens
import StationDetailScreen from "../features/station/screens/StationDetailScreen";
import MapScreen from "../features/station/screens/MapScreen";
// QR screens
import QRScanScreen from "../features/qr/screens/QRScanScreen";
// Swap screens
import { SwapSessionScreen } from "../features/swap/screens/SwapSessionScreen";
import { SwapSuccessScreen } from "../features/swap/screens/SwapSuccessScreen";
import { SwapHistoryScreen } from "../features/swap/screens/SwapHistoryScreen";
// Kiosk screens
import KioskSessionScreen from "../features/kiosk/screens/KioskSessionScreen";
// Payment screens
import { PaymentMethodsScreen } from "../features/payment/screens/PaymentMethodsScreen";
import { TopUpScreen } from "../features/payment/screens/TopUpScreen";
import { PaymentHistoryScreen } from "../features/payment/screens/PaymentHistoryScreen";
import PaymentScreen from "../features/payment/screens/PaymentScreen";
// Profile screens
import EditProfileScreen from "../features/profile/screens/EditProfileScreen";
import SettingsScreen from "../features/profile/screens/SettingsScreen";
// Reservation screens
import ReservationScreen from "../features/reservation/screens/ReservationScreen";
// Invoice screens
import InvoiceScreen from "../features/invoice/screens/InvoiceScreen";
// Rating screens
import RatingHistoryScreen, {
  RatingModal,
} from "../features/support/screens/RatingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={MainNavigator} />

      {/* Station Screens */}
      <Stack.Screen
        name="StationDetails"
        component={StationDetailScreen}
        options={{
          headerShown: true,
          title: "Chi tiết trạm",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="StationMap"
        component={MapScreen}
        options={{
          headerShown: true,
          title: "Bản đồ trạm",
          headerBackTitle: "Trở về",
        }}
      />

      {/* Reservation Screens */}
      <Stack.Screen
        name="ReservationConfirm"
        component={ReservationScreen}
        options={{
          headerShown: true,
          title: "Xác nhận đặt chỗ",
          headerBackTitle: "Trở về",
        }}
      />

      {/* Swap Screens */}
      <Stack.Screen
        name="QRScan"
        component={QRScanScreen}
        options={{
          headerShown: true,
          title: "Quét QR",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="SwapSession"
        component={SwapSessionScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent swipe back during swap
        }}
      />
      <Stack.Screen
        name="SwapSuccess"
        component={SwapSuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="SwapHistory"
        component={SwapHistoryScreen}
        options={{
          headerShown: true,
          title: "Lịch sử đổi pin",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="KioskSession"
        component={KioskSessionScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* Payment Screens */}
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{
          headerShown: true,
          title: "Phương thức thanh toán",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: true,
          title: "Thanh toán",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUpScreen}
        options={{
          headerShown: true,
          title: "Nạp tiền",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          headerShown: true,
          title: "Lịch sử thanh toán",
          headerBackTitle: "Trở về",
        }}
      />

      {/* Invoice Screen */}
      <Stack.Screen
        name="InvoiceScreen"
        component={InvoiceScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Rating Screen */}
      <Stack.Screen
        name="StationRating"
        component={RatingHistoryScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Profile Screens */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: "Chỉnh sửa hồ sơ",
          headerBackTitle: "Trở về",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: "Cài đặt",
          headerBackTitle: "Trở về",
        }}
      />
    </Stack.Navigator>
  );
}
