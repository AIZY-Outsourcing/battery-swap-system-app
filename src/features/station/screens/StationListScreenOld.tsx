import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { mockData } from "../../../data/mockData";
import { Station } from "../../../data/mockData";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, Input, ThemedButton } from "../../../components";

export default function StationListScreen({ navigation }: any) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "available" | "busy"
  >("all");

  const filteredStations = mockData.stations.filter((station: Station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "available")
      return matchesSearch && station.status === "available";
    if (selectedFilter === "busy")
      return matchesSearch && station.status === "busy";

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
        return "Có sẵn";
      case "busy":
        return "Đang sử dụng";
      case "maintenance":
        return "Bảo trì";
      default:
        return "Offline";
    }
  };

  const renderStationCard = ({ item }: { item: Station }) => (
    <ThemedCard style={{ marginBottom: theme.spacing[3] }}>
      <View style={styles.stationHeader}>
        <Text
          style={[styles.stationName, { color: theme.colors.text.primary }]}
        >
          {item.name}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={[styles.statusText, { color: theme.colors.text.white }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.address, { color: theme.colors.text.secondary }]}>
        {item.address}
      </Text>

      <Text style={[styles.distance, { color: theme.colors.text.tertiary }]}>
        Cách {item.distance}km
      </Text>

      <View style={styles.batteryInfo}>
        <Text
          style={[styles.batteryText, { color: theme.colors.text.secondary }]}
        >
          Pin có sẵn:{" "}
          {item.availableBatteries.A +
            item.availableBatteries.B +
            item.availableBatteries.C}
        </Text>
        <View style={styles.batteryTypes}>
          <Text
            style={[styles.batteryType, { color: theme.colors.text.tertiary }]}
          >
            A: {item.availableBatteries.A}
          </Text>
          <Text
            style={[styles.batteryType, { color: theme.colors.text.tertiary }]}
          >
            B: {item.availableBatteries.B}
          </Text>
          <Text
            style={[styles.batteryType, { color: theme.colors.text.tertiary }]}
          >
            C: {item.availableBatteries.C}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <ThemedButton
          title="Xem chi tiết"
          variant="secondary"
          size="sm"
          onPress={() =>
            navigation.navigate("StationDetail", { stationId: item.id })
          }
          style={[styles.actionButton, { marginRight: theme.spacing[2] }]}
        />
        <ThemedButton
          title="Đặt trước"
          variant="primary"
          size="sm"
          onPress={() =>
            navigation.navigate("BookReservation", { stationId: item.id })
          }
          style={styles.actionButton}
        />
      </View>
    </ThemedCard>
  );

  const renderFilterButton = (
    filter: "all" | "available" | "busy",
    label: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            selectedFilter === filter
              ? theme.colors.primary
              : theme.colors.surface.elevated,
          borderColor: theme.colors.border.default,
        },
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          {
            color:
              selectedFilter === filter
                ? theme.colors.text.white
                : theme.colors.text.primary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface.default },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Trạm đổi pin
        </Text>

        <Input
          placeholder="Tìm kiếm trạm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { marginTop: theme.spacing[4] }]}
        />

        <View style={[styles.filterContainer, { marginTop: theme.spacing[3] }]}>
          {renderFilterButton("all", "Tất cả")}
          {renderFilterButton("available", "Có sẵn")}
          {renderFilterButton("busy", "Đang sử dụng")}
        </View>
      </View>

      <FlatList
        data={filteredStations}
        renderItem={renderStationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchInput: {
    // Styles handled by themed Input component
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  stationCard: {
    // Styles handled by ThemedCard component
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    marginBottom: 12,
  },
  batteryInfo: {
    marginBottom: 16,
  },
  batteryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  batteryTypes: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  batteryType: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flex: 1,
  },
});
