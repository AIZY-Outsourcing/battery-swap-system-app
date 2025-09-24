import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, ThemedButton } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";
import { CompositeScreenProps } from "@react-navigation/native";
import { ScrollView } from "react-native";

type Props = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock stations data
  const stations = [
    {
      id: "1",
      name: "FPT Tower Station",
      address: "17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy",
      distance: "0.5 km",
      availableBatteries: 8,
      totalSlots: 12,
      batteryTypes: ["A", "B"],
      status: "active",
    },
    {
      id: "2",
      name: "Keangnam Station",
      address: "72 Phạm Hùng, Nam Từ Liêm",
      distance: "1.2 km",
      availableBatteries: 3,
      totalSlots: 8,
      batteryTypes: ["A"],
      status: "active",
    },
    {
      id: "3",
      name: "Lotte Tower Station",
      address: "54 Liễu Giai, Ba Đình",
      distance: "2.1 km",
      availableBatteries: 0,
      totalSlots: 10,
      batteryTypes: ["A", "B"],
      status: "maintenance",
    },
  ];

  const filters = [
    { id: "all", label: "Tất cả", icon: "🏠" },
    { id: "nearby", label: "Gần nhất", icon: "📍" },
    { id: "available", label: "Có pin", icon: "🔋" },
    { id: "typeA", label: "Pin A", icon: "⚡" },
    { id: "typeB", label: "Pin B", icon: "🔌" },
  ];

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    switch (selectedFilter) {
      case "nearby":
        return matchesSearch && parseFloat(station.distance) <= 1.0;
      case "available":
        return matchesSearch && station.availableBatteries > 0;
      case "typeA":
        return matchesSearch && station.batteryTypes.includes("A");
      case "typeB":
        return matchesSearch && station.batteryTypes.includes("B");
      default:
        return matchesSearch;
    }
  });

  const renderStationCard = ({
    item: station,
  }: {
    item: (typeof stations)[0];
  }) => (
    <ThemedCard style={styles.stationCard}>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore - We'll fix navigation types later
          navigation
            .getParent()
            ?.navigate("StationDetails", { stationId: station.id });
        }}
      >
        <View style={styles.stationHeader}>
          <View style={styles.stationInfo}>
            <Text
              style={[styles.stationName, { color: theme.colors.text.primary }]}
            >
              {station.name}
            </Text>
            <Text
              style={[
                styles.stationAddress,
                { color: theme.colors.text.secondary },
              ]}
            >
              📍 {station.address}
            </Text>
            <Text
              style={[
                styles.stationDistance,
                { color: theme.colors.text.tertiary },
              ]}
            >
              {station.distance}
            </Text>
          </View>
          <View style={styles.stationStatus}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    station.status === "active"
                      ? theme.colors.success
                      : theme.colors.warning,
                },
              ]}
            >
              <Text style={styles.statusText}>
                {station.status === "active" ? "Hoạt động" : "Bảo trì"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stationStats}>
          <View style={styles.batteryInfo}>
            <Text
              style={[
                styles.batteryCount,
                { color: theme.colors.text.primary },
              ]}
            >
              🔋 {station.availableBatteries}/{station.totalSlots}
            </Text>
            <Text
              style={[
                styles.batteryTypes,
                { color: theme.colors.text.secondary },
              ]}
            >
              Pin: {station.batteryTypes.join(", ")}
            </Text>
          </View>
          <ThemedButton
            title="Đặt chỗ"
            size="sm"
            variant="primary"
            onPress={() => {
              // @ts-ignore - We'll fix navigation types later
              navigation
                .getParent()
                ?.navigate("ReservationConfirm", { stationId: station.id });
            }}
          />
        </View>
      </TouchableOpacity>
    </ThemedCard>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
    >
      {/* Header với Search và Map Button */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Trạm đổi pin 🔋</Text>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm trạm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.secondary}
          />
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              // @ts-ignore - We'll fix navigation types later
              navigation.getParent()?.navigate("StationMap");
            }}
          >
            <Text style={styles.mapButtonText}>🗺️</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    selectedFilter === filter.id
                      ? theme.colors.surface.default
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stations List */}
      <FlatList
        data={filteredStations}
        renderItem={renderStationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.stationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <ThemedCard style={styles.emptyCard}>
            <Text
              style={[styles.emptyText, { color: theme.colors.text.secondary }]}
            >
              Không tìm thấy trạm nào phù hợp 🔍
            </Text>
          </ThemedCard>
        )}
      />
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  mapButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    fontSize: 20,
  },
  filterContainer: {
    backgroundColor: "transparent",
    paddingVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  stationsList: {
    padding: 20,
    paddingTop: 0,
  },
  stationCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 12,
  },
  stationStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  stationStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  batteryInfo: {
    flex: 1,
  },
  batteryCount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  batteryTypes: {
    fontSize: 12,
  },
  emptyCard: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
