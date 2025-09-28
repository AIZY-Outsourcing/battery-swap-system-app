import React from "react";
import "./src/i18n";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
