import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  style,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...props
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
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
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error
              ? theme.colors.error
              : focused
              ? theme.colors.border.focused
              : theme.colors.border.default,
            backgroundColor: theme.colors.surface.default,
            borderRadius: theme.borderRadius.base,
            paddingHorizontal: theme.spacing[3],
            minHeight: 48,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.textInput,
            {
              flex: 1,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              paddingVertical: theme.spacing[2],
            },
            style,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  textInput: {
    // inline
  },
});
