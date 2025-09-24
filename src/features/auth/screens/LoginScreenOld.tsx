import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../theme/ThemeProvider";
import { Input, ThemedButton } from "../../../components";
import { AuthStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // TODO: Implement actual login logic
    Alert.alert("Success", "Login functionality to be implemented");
  };

  const handlePhoneLogin = () => {
    // Navigate to phone OTP flow
    navigation.navigate("OTPVerification", {
      phone: "+1234567890",
      email: email || "test@example.com",
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Sign In
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Welcome back to BSS
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: theme.spacing[4] }}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: theme.spacing[6] }}
        />

        <ThemedButton
          title="Sign In"
          onPress={handleLogin}
          variant="primary"
          fullWidth
          style={{ marginBottom: theme.spacing[4] }}
        />

        <Text style={[styles.orText, { color: theme.colors.text.tertiary }]}>
          OR
        </Text>

        <ThemedButton
          title="Continue with Phone"
          onPress={handlePhoneLogin}
          variant="secondary"
          fullWidth
          style={{ marginBottom: theme.spacing[6] }}
        />

        <ThemedButton
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate("Register")}
          variant="tertiary"
          size="sm"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 16,
  },
});
