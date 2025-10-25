import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import WelcomeScreen from "../features/auth/screens/WelcomeScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";
import VehicleSetupScreen from "../features/auth/screens/VehicleSetupScreen";
import EmailVerificationScreen from "../features/auth/screens/EmailVerificationScreen";
import PinSetupScreen from "../features/auth/screens/PinSetupScreen";

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
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen name="PinSetup" component={PinSetupScreen} />
      <Stack.Screen name="VehicleSetup" component={VehicleSetupScreen} />
    </Stack.Navigator>
  );
}
