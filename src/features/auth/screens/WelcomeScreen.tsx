import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import AuthLayout from "../components/AuthLayout";
import { ThemedButton, ThemedCard } from "../../../components";
import { useTheme } from "../../../theme/ThemeProvider";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  return (
    <AuthLayout
      title="Welcome to BSS"
      subtitle="Your EV Battery Swapping Solution"
    >
      <ThemedCard>
        <View style={{ gap: theme.spacing[4] }}>
          <ThemedButton
            title="Get Started"
            onPress={() => navigation.navigate("Login")}
            fullWidth
          />
          <ThemedButton
            title="Create Account"
            onPress={() => navigation.navigate("Register")}
            variant="secondary"
            fullWidth
          />
        </View>
      </ThemedCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({});
