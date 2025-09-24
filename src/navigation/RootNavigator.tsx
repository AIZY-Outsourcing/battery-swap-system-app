import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import SplashScreen from "../features/auth/screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import AppStackNavigator from "./AppStackNavigator";
// import { useSelector } from "react-redux";
// import { RootState } from '../store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
        <Stack.Screen name="AppStack" component={AppStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
