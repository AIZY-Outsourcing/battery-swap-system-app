import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "sm" | "base" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "base",
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const theme = useTheme();

  const buttonStyles: ViewStyle = {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal:
      size === "sm"
        ? theme.spacing[3]
        : size === "lg"
        ? theme.spacing[6]
        : theme.spacing[4],
    paddingVertical:
      size === "sm"
        ? theme.spacing[2]
        : size === "lg"
        ? theme.spacing[4]
        : theme.spacing[3],
    alignItems: "center",
    justifyContent: "center",
    ...(fullWidth && { width: "100%" }),
    ...(disabled && { opacity: 0.6 }),
  };

  const textStyles: TextStyle = {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize:
      size === "sm"
        ? theme.typography.fontSize.sm
        : size === "lg"
        ? theme.typography.fontSize.lg
        : theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          button: { backgroundColor: theme.colors.button.primary },
          text: { color: theme.colors.text.white },
        };
      case "secondary":
        return {
          button: { backgroundColor: theme.colors.button.secondary },
          text: { color: theme.colors.text.primary },
        };
      case "tertiary":
        return {
          button: { backgroundColor: theme.colors.button.tertiary },
          text: { color: theme.colors.text.primary },
        };
      case "destructive":
        return {
          button: { backgroundColor: theme.colors.button.destructive },
          text: { color: theme.colors.text.white },
        };
      default:
        return {
          button: { backgroundColor: theme.colors.button.primary },
          text: { color: theme.colors.text.white },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      style={[buttonStyles, variantStyles.button, style]}
      disabled={disabled}
      {...props}
    >
      <Text style={[textStyles, variantStyles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};
