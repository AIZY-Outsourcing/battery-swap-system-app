import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { mockData } from "../../../data/mockData";
import { Station } from "../../../data/mockData";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, Input, ThemedButton } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function StationListScreen({ navigation }: any) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "available" | "busy">("all");

  const filteredStations = mockData.stations.filter((station: Station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "available") return matchesSearch && station.status === "available";
    if (selectedFilter === "busy") return matchesSearch && station.status === "busy";

    return matchesSearch;
  });

  const getStatusColor = (status: Station["status"]) => {
    switch (status) {
      case "available":
        return theme.colors.station.available;
      case "busy":
        return theme.colors.station.busy;
      case "maintenance":
        return theme.colors.station.maintenance;
      default:
        return theme.colors.station.offline;
    }
  };

  const getStatusText = (status: Station["status"]) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "maintenance":
        return "Maintenance";
      default:
        return "Offline";
    }
  };

  const getStatusGradient = (status: Station["status"]) => {
    switch (status) {
      case "available":
        return [theme.colors.station.available, theme.colors.battery.high] as const;
      case "busy":
        return [theme.colors.station.busy, theme.colors.tertiary] as const;
      case "maintenance":
        return [theme.colors.station.maintenance, "#FF8A80"] as const;
      default:
        return [theme.colors.station.offline, theme.colors.text.tertiary] as const;
    }
  };

  const renderStationCard = ({ item }: { item: Station }) => (
    <ThemedCard style={{ marginBottom: theme.spacing[4], marginHorizontal: theme.spacing[4], overflow: "hidden" }}>
      {/* Status Header with Gradient */}
      <LinearGradient
        colors={getStatusGradient(item.status)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.stationStatusHeader}
      >
        <View style={styles.stationHeaderContent}>
          <View style={styles.stationTitleContainer}>
            <Text style={styles.stationName}>{item.name}</Text>
            <Text style={styles.stationStatusText}>{getStatusText(item.status)}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>{item.distance}km</Text>
            <Text style={styles.etaText}>{item.estimatedTravelTime} min</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Station Details */}
      <View style={styles.stationBody}>
        <Text style={[styles.address, { color: theme.colors.text.secondary }]}>
          📍 {item.address}
        </Text>

        {/* Battery Availability */}
        <View style={styles.batterySection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Battery Availability
          </Text>
          <View style={styles.batteryGrid}>
            <View style={styles.batteryItem}>
              <View style={[styles.batteryIcon, { backgroundColor: theme.colors.battery.high }]}>
                <Text style={styles.batteryIconText}>A</Text>
              </View>
              <Text style={[styles.batteryCount, { color: theme.colors.text.primary }]}>
                {item.availableBatteries.A}
              </Text>
            </View>
            <View style={styles.batteryItem}>
              <View style={[styles.batteryIcon, { backgroundColor: theme.colors.battery.medium }]}>
                <Text style={styles.batteryIconText}>B</Text>
              </View>
              <Text style={[styles.batteryCount, { color: theme.colors.text.primary }]}>
                {item.availableBatteries.B}
              </Text>
            </View>
            <View style={styles.batteryItem}>
              <View style={[styles.batteryIcon, { backgroundColor: theme.colors.accent }]}>
                <Text style={styles.batteryIconText}>C</Text>
              </View>
              <Text style={[styles.batteryCount, { color: theme.colors.text.primary }]}>
                {item.availableBatteries.C}
              </Text>
            </View>
          </View>
        </View>

        {/* Rating and Hours */}
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={[styles.reviewCount, { color: theme.colors.text.tertiary }]}>
              ({item.totalReviews})
            </Text>
          </View>
          <Text style={[styles.hours, { color: item.isOpen ? theme.colors.station.available : theme.colors.error }]}>
            {item.isOpen ? "Open" : "Closed"} • {item.operatingHours.open} - {item.operatingHours.close}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <ThemedButton
            title="View Details"
            variant="secondary"
            size="sm"
            onPress={() => navigation.navigate("StationDetail", { stationId: item.id })}
            style={{ flex: 1, marginRight: theme.spacing[2] }}
          />
          <ThemedButton
            title="Book Now"
            variant="primary"
            size="sm"
            onPress={() => navigation.navigate("BookReservation", { stationId: item.id })}
            style={{ flex: 1 }}
            disabled={item.status !== "available"}
          />
        </View>
      </View>
    </ThemedCard>
  );

  const renderFilterButton = (filter: "all" | "available" | "busy", label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedFilter === filter ? theme.colors.primary : theme.colors.surface.elevated,
          borderColor: selectedFilter === filter ? theme.colors.primary : theme.colors.border.default,
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.8}
    >
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text
        style={[
          styles.filterText,
          {
            color: selectedFilter === filter ? theme.colors.text.white : theme.colors.text.primary
          }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Find Stations</Text>
          <Text style={styles.headerSubtitle}>
            {filteredStations.length} stations found nearby
          </Text>
        </View>
      </LinearGradient>

      {/* Search and Filters */}
      <View style={[styles.searchContainer, { marginTop: -theme.spacing[6] }]}>
        <ThemedCard style={{ marginHorizontal: theme.spacing[4], marginBottom: theme.spacing[4] }}>
          <Input
            placeholder="Search stations or addresses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginBottom: theme.spacing[4] }}
          />
          <View style={styles.filterContainer}>
            {renderFilterButton("all", "All", "🔍")}
            {renderFilterButton("available", "Available", "🟢")}
            {renderFilterButton("busy", "Busy", "🟡")}
          </View>
        </ThemedCard>
      </View>

      {/* Station List */}
      <FlatList
        data={filteredStations}
        renderItem={renderStationCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing[6] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  searchContainer: {
    zIndex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    justifyContent: "center",
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stationStatusHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stationHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationTitleContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  stationStatusText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  distanceContainer: {
    alignItems: "flex-end",
  },
  distanceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  etaText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  stationBody: {
    padding: 20,
  },
  address: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  batterySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  batteryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  batteryItem: {
    alignItems: "center",
  },
  batteryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  batteryIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  batteryCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
  },
  hours: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
  },
});