// Color palette from coolors.co
export const colors = {
  // Primary colors from the palette
  primary: "#5D7B6F", // Dark green-gray
  primaryLight: "#A4C3A2", // Light sage green
  secondary: "#B0D4B8", // Mint green
  tertiary: "#EAE7D6", // Warm beige
  accent: "#D7F5FA", // Light cyan

  // Semantic colors
  success: "#B0D4B8", // Mint green for success states
  warning: "#EAE7D6", // Beige for warnings
  error: "#FF6B6B", // Red for errors (added)
  info: "#D7F5FA", // Light cyan for info

  // Text colors
  text: {
    primary: "#2C3E35", // Dark green-gray for primary text
    secondary: "#5D7B6F", // Medium green for secondary text
    tertiary: "#8A9B8E", // Light green-gray for tertiary text
    white: "#FFFFFF", // White text
    disabled: "#B8C5BC", // Disabled text
  },

  // Background colors
  background: {
    primary: "#FFFFFF", // Main background
    secondary: "#F8FAF9", // Secondary background (very light green tint)
    tertiary: "#D7F5FA", // Light cyan background
    card: "#FFFFFF", // Card background
    overlay: "rgba(45, 62, 53, 0.5)", // Dark overlay
  },

  // Surface colors
  surface: {
    default: "#FFFFFF",
    elevated: "#F8FAF9",
    pressed: "#EAE7D6",
  },

  // Border colors
  border: {
    default: "#E5ECE7", // Light green-gray
    focused: "#5D7B6F", // Primary color
    disabled: "#D1DDD3", // Very light green-gray
  },

  // Button colors
  button: {
    primary: "#5D7B6F",
    primaryPressed: "#4A6259",
    secondary: "#B0D4B8",
    secondaryPressed: "#9BC9A1",
    tertiary: "#EAE7D6",
    tertiaryPressed: "#DDD9C6",
    disabled: "#D1DDD3",
    destructive: "#FF6B6B",
    destructivePressed: "#FF5252",
  },

  // Status colors for BSS specific states
  battery: {
    high: "#B0D4B8", // Green for high battery
    medium: "#EAE7D6", // Beige for medium battery
    low: "#FF6B6B", // Red for low battery
    charging: "#D7F5FA", // Cyan for charging
  },

  // Station status colors
  station: {
    available: "#B0D4B8", // Green for available
    busy: "#EAE7D6", // Beige for busy
    maintenance: "#FF6B6B", // Red for maintenance
    offline: "#8A9B8E", // Gray for offline
  },
} as const;

export type Colors = typeof colors;
