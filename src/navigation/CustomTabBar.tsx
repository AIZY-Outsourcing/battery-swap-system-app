import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
type MCIconName = React.ComponentProps<typeof Icon>["name"];

// Custom MoMo-like bottom tab bar
// - White bar with subtle top border
// - Center raised circular action button + pill label
// - Other tabs show small gray icon + label
export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const accent = "#5D7B6F"; // primary accent used in app
  const inactive = "#8E8E93";
  const insets = useSafeAreaInsets();
  const bottomGap = Math.max(insets.bottom + 6, 12); // keep some distance from system gesture

  // Map route name to a MaterialCommunityIcons icon name
  const iconFor = (name: string): MCIconName => {
    switch (name) {
      case "Home":
        return "home-outline";
      case "MyReservations":
        return "clipboard-text-outline";
      case "QRScan":
        return "qrcode-scan";
      case "History":
        return "history";
      case "Profile":
        return "account-circle-outline";
      default:
        return "shape-outline";
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomGap }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            (options.tabBarLabel as string) ??
            (options.title as string) ??
            route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Special center action
          if (route.name === "QRScan") {
            return (
              <View key={route.key} style={styles.centerSlot}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[styles.fab, { backgroundColor: accent }]}
                  activeOpacity={0.8}
                >
                  <Icon name={iconFor(route.name)} size={30} color="#ffffff" />
                </TouchableOpacity>
                <View style={[styles.pill, { backgroundColor: accent }]}>
                  <Text style={styles.pillText}>{label}</Text>
                </View>
              </View>
            );
          }

          // Regular items
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
              activeOpacity={0.7}
            >
              {/* Active top indicator bar */}
              <View
                style={[
                  styles.activeBar,
                  { backgroundColor: accent, opacity: isFocused ? 1 : 0 },
                ]}
              />
              <Icon
                name={iconFor(route.name)}
                size={24}
                color={isFocused ? accent : inactive}
              />
              <Text
                style={[styles.label, { color: isFocused ? accent : inactive }]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 92,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginBottom: 8, // lift items a bit so they don't feel too low
  },
  activeBar: {
    height: 3,
    width: 22,
    borderRadius: 2,
    marginBottom: 6,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  centerSlot: {
    width: 92,
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -26, // lift the button to create the 'bump' effect
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 0,
      },
    }),
  },
  fabIcon: {
    fontSize: 28,
    color: "#ffffff",
  },
  pill: {
    marginTop: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});
