import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainTabParamList } from "../../../navigation/types";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, ThemedButton } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<MainTabParamList, "Home">;

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();

  const quickActions = [
    {
      title: "Find Station",
      subtitle: "Locate nearby stations",
      icon: "🗺️",
      action: () => navigation.navigate("QRScan"),
      color: theme.colors.primary,
    },
    {
      title: "My Reservations",
      subtitle: "View active bookings",
      icon: "📋",
      action: () => navigation.navigate("MyReservations"),
      color: theme.colors.secondary,
    },
    {
      title: "Quick Swap",
      subtitle: "Instant battery swap",
      icon: "⚡",
      action: () => {},
      color: theme.colors.accent,
    },
    {
      title: "Support",
      subtitle: "Get help & assistance",
      icon: "💬",
      action: () => {},
      color: theme.colors.tertiary,
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: theme.spacing[12] }]}>
        <Text
          style={[styles.welcomeText, { color: theme.colors.text.secondary }]}
        >
          Welcome back!
        </Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Ready to swap?
        </Text>
      </View>

      <ThemedCard style={{ margin: theme.spacing[4] }}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Your Stats
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              12
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Total Swaps
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[styles.statNumber, { color: theme.colors.battery.high }]}
            >
              85%
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Battery Health
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
              5
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Nearby Stations
            </Text>
          </View>
        </View>
      </ThemedCard>

      <View
        style={[styles.quickActions, { paddingHorizontal: theme.spacing[4] }]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <ThemedButton
              key={index}
              title={action.title}
              onPress={action.action}
              variant="secondary"
              size="sm"
              style={{ margin: theme.spacing[1] }}
            />
          ))}
        </View>
      </View>

      <ThemedCard style={{ margin: theme.spacing[4] }}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Recent Activity
        </Text>
        <View style={styles.activityItem}>
          <Text
            style={[styles.activityTitle, { color: theme.colors.text.primary }]}
          >
            Battery Swap Completed
          </Text>
          <Text
            style={[
              styles.activitySubtitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Station A - Downtown
          </Text>
          <Text
            style={[styles.activityTime, { color: theme.colors.text.tertiary }]}
          >
            2 hours ago
          </Text>
        </View>
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  activityItem: {
    marginTop: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  activitySubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
});
