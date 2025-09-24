// App Configuration
export const APP_NAME = "BSS";
export const APP_VERSION = "1.0.0";

// API Configuration
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://api.bss-app.com";

export const API_TIMEOUT = 10000; // 10 seconds

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "@bss_auth_token",
  USER_DATA: "@bss_user_data",
  ONBOARDING_COMPLETED: "@bss_onboarding_completed",
  PUSH_NOTIFICATIONS: "@bss_push_notifications",
  THEME: "@bss_theme",
} as const;

// Colors
export const COLORS = {
  primary: "#007AFF",
  primaryDark: "#0056CC",
  secondary: "#f8f9fa",
  accent: "#FF9800",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // Grays
  white: "#FFFFFF",
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#6c757d",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
  black: "#000000",

  // Text
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  textDisabled: "#adb5bd",

  // Background
  background: "#f8f9fa",
  surface: "#ffffff",
  surfaceLight: "#f8f9fa",
} as const;

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 32,
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Screen Names
export const SCREENS = {
  // Auth Stack
  WELCOME: "Welcome",
  LOGIN: "Login",
  REGISTER: "Register",
  OTP_VERIFICATION: "OTPVerification",

  // Main Tab Stack
  HOME: "Home",
  STATIONS: "Stations",
  HISTORY: "History",
  PROFILE: "Profile",

  // Other Screens
  STATION_DETAILS: "StationDetails",
  RESERVATION_CONFIRM: "ReservationConfirm",
  KIOSK_SESSION: "KioskSession",
  PAYMENT_SCREEN: "PaymentScreen",
} as const;
