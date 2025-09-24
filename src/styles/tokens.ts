export const styleTokens = {
  colors: {
    bg: "#071a2b", // dark navy background
    card: "#0f2b3a", // card background
    muted: "#9fb3bd", // muted text
    primary: "#1e90ff", // accent blue for CTAs
    success: "#28c76f", // green availability
    danger: "#ff4d4f", // maintenance
    white: "#ffffff",
    surface: "#132a3a", // slightly lighter than card
  },
  radius: 14,
  padding: 16,
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  typography: {
    headline: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: "#ffffff",
    },
    subtitle: {
      fontSize: 14,
      color: "#9fb3bd",
    },
    small: {
      fontSize: 12,
      color: "#9fb3bd",
    },
    body: {
      fontSize: 16,
      color: "#ffffff",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
};
