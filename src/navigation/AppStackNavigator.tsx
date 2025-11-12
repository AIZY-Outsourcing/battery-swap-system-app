import React from "react";
import { useTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

// Import all screens
import MainNavigator from "./MainNavigator";
// Station screens
import StationDetailScreen from "../features/station/screens/StationDetailScreen";
// QR screens
import QRScanScreen from "../features/qr/screens/QRScanScreen";
// Auth screens
import PinVerificationScreen from "../features/auth/screens/PinVerificationScreen";
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
import BuySwapScreen from "../features/payment/screens/BuySwapScreen";
import BuyPackageScreen from "../features/payment/screens/BuyPackageScreen";
import OrderDetailsScreen from "../features/payment/screens/OrderDetailsScreen";
import PaymentSuccessScreen from "../features/payment/screens/PaymentSuccessScreen";
// Profile screens
import EditProfileScreen from "../features/profile/screens/EditProfileScreen";
import SettingsScreen from "../features/profile/screens/SettingsScreen";
import AccountDetailsScreen from "../features/profile/screens/AccountDetailsScreen";
import MyVehiclesScreen from "../features/profile/screens/MyVehiclesScreen";
import AddVehicleScreen from "../features/profile/screens/AddVehicleScreen";
import VehicleDetailScreen from "../features/profile/screens/VehicleDetailScreen";
import EditVehicleScreen from "../features/profile/screens/EditVehicleScreen";
// Reservation screens
import ReservationConfirmScreen from "../features/reservation/screens/ReservationConfirmScreen";
// Invoice screens
import InvoiceScreen from "../features/invoice/screens/InvoiceScreen";
// Rating screens
import RatingHistoryScreen, {
  RatingModal,
} from "../features/support/screens/RatingScreen";
import CreateSupportRequestScreen from "../features/support/screens/CreateSupportRequestScreen";
import SupportRequestScreen from "../features/support/screens/SupportRequestScreen";
import ViewSupportRequestScreen from "../features/support/screens/ViewSupportRequestScreen";
import StationMapScreen from "../features/station/screens/StationMapScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStackNavigator() {
  const { t } = useTranslation();
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
          title: t("station.details"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="StationMap"
        component={StationMapScreen}
        options={{
          headerShown: true,
          title: t("station.map"),
          headerBackTitle: t("common.back"),
        }}
      />

      {/* Reservation Screens */}
      <Stack.Screen
        name="ReservationConfirm"
        component={ReservationConfirmScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Swap Screens */}
      <Stack.Screen
        name="QRScan"
        component={QRScanScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PinVerification"
        component={PinVerificationScreen}
        options={{
          headerShown: false,
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
          title: t("swap.history"),
          headerBackTitle: t("common.back"),
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
          title: t("payment.methods"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: true,
          title: t("payment.title"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUpScreen}
        options={{
          headerShown: true,
          title: t("payment.topUp"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          headerShown: true,
          title: t("payment.history"),
          headerBackTitle: t("common.back"),
        }}
      />

      {/* Purchase Screens */}
      <Stack.Screen
        name="BuySwap"
        component={BuySwapScreen}
        options={{
          headerShown: true,
          title: t("buySwap.header"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="BuyPackage"
        component={BuyPackageScreen}
        options={{
          headerShown: true,
          title: t("buyPackage.header"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          headerShown: true,
          title: t("order.details"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          headerShown: true,
          title: t("paymentSuccess.title"),
          headerBackTitle: t("common.back"),
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

      {/* Support Screens */}
      <Stack.Screen
        name="CreateSupportRequest"
        component={CreateSupportRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SupportRequest"
        component={SupportRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SupportRequestDetail"
        component={ViewSupportRequestScreen}
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
          title: t("profile.edit"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: t("settings.title"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          headerShown: true,
          title: t("credits.manage"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{
          headerShown: true,
          title: "Xe của tôi",
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{
          headerShown: true,
          title: "Thêm xe mới",
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{
          headerShown: true,
          title: "Chi tiết xe",
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="EditVehicle"
        component={EditVehicleScreen}
        options={{
          headerShown: true,
          title: "Chỉnh sửa xe",
          headerBackTitle: t("common.back"),
        }}
      />
    </Stack.Navigator>
  );
}
