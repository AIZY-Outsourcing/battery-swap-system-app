import React from "react";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
