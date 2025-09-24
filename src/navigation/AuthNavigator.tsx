import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import WelcomeScreen from "../features/auth/screens/WelcomeScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import OTPVerificationScreen from "../features/auth/screens/OTPVerificationScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";
import VehicleSetupScreen from "../features/auth/screens/VehicleSetupScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="VehicleSetup" component={VehicleSetupScreen} />
    </Stack.Navigator>
  );
}
