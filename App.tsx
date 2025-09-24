import React from "react";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { ThemeProvider } from "./src/theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
