import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof import("../theme").spacing;
}

export const Card: React.FC<CardProps> = ({ children, style, padding = 4 }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface.default,
          borderRadius: theme.borderRadius.base,
          padding: theme.spacing[padding],
          ...theme.shadows.base,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
