import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FilterType } from "../types/station";
import { styleTokens } from "../styles/tokens";

interface FilterChipsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS = [
  { id: "all" as FilterType, label: "Tất cả", icon: "map-marker" },
  {
    id: "station" as FilterType,
    label: "Trạm sạc",
    icon: "battery-charging-medium",
  },
  { id: "dealer" as FilterType, label: "Đại lý", icon: "store-outline" },
  {
    id: "service" as FilterType,
    label: "Xưởng dịch vụ",
    icon: "wrench-outline",
  },
];

export default function FilterChips({
  selectedFilter,
  onFilterChange,
}: FilterChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((f) => {
          const active = f.id === selectedFilter;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onFilterChange(f.id)}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={14}
                  color={active ? "#fff" : "#ccc"}
                />
                <Text style={[styles.label, active && styles.labelActive]}>
                  {f.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollContent: {
    paddingHorizontal: styleTokens.padding,
    paddingVertical: styleTokens.spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: styleTokens.padding,
    paddingVertical: styleTokens.spacing.sm,
    borderRadius: 25,
    marginRight: styleTokens.spacing.sm,
    ...styleTokens.shadow,
  },
  chipActive: {
    backgroundColor: styleTokens.colors.primary,
  },
  icon: {
    fontSize: 16,
    marginRight: styleTokens.spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: styleTokens.colors.bg,
  },
  labelActive: {
    color: styleTokens.colors.white,
  },
});
