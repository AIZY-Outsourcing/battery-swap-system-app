import React from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              marginBottom: theme.spacing[1],
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error
              ? theme.colors.error
              : theme.colors.border.default,
            borderRadius: theme.borderRadius.base,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[3],
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.surface.default,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.text.tertiary}
        {...props}
      />
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error : theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.xs,
              marginTop: theme.spacing[1],
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    // Styles handled inline with theme
  },
  helperText: {
    // Styles handled inline with theme
  },
});
