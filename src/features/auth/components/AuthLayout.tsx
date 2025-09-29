import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../theme/ThemeProvider";

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

/**
 * Shared layout for authentication flow screens providing:
 * - Gradient brand background
 * - Consistent header (title + subtitle)
 * - Scrollable, keyboard-aware content area
 * - Centralized spacing & typography using theme tokens
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  headerExtra,
  contentContainerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.primaryLight,
          theme.colors.secondary,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: theme.spacing[5],
            paddingTop: theme.spacing[12],
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {(title || subtitle || headerExtra) && (
          <View style={styles.header}>
            {title && (
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.text.white,
                    fontSize: theme.typography.fontSize["3xl"],
                    fontWeight: theme.typography.fontWeight.bold as any,
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.text.white,
                    fontSize: theme.typography.fontSize.base,
                  },
                  subtitleStyle,
                ]}
              >
                {subtitle}
              </Text>
            )}
            {headerExtra}
          </View>
        )}
        <View
          style={{ gap: theme.spacing[6], marginBottom: theme.spacing[12] }}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
});

export default AuthLayout;
