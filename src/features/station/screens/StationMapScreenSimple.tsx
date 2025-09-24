import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import FilterChips from "../../../components/FilterChips";
import FloatingActions from "../../../components/FloatingActions";
import StationCard from "../../../components/StationCard";

// Data & Utils
import { stations } from "../../../data/stations";
import { Station, FilterType, MapViewMode } from "../../../types/station";
import { styleTokens } from "../../../styles/tokens";

const { width, height } = Dimensions.get("window");

export default function StationMapScreen() {
  const mapRef = useRef<MapView>(null);

  // State
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapMode, setMapMode] = useState<MapViewMode>("standard");
  const [showList, setShowList] = useState(false);

  const filteredStations = stations.filter((station) => {
    if (selectedFilter === "all") return true;
    return station.type === selectedFilter;
  });

  const handleMarkerPress = (station: Station) => {
    setSelectedStation(station);

    // Center map on selected station
    mapRef.current?.animateToRegion(
      {
        latitude: station.lat,
        longitude: station.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );

    setShowList(true);
  };

  const handleCardPress = (station: Station) => {
    setSelectedStation(station);

    // Center map on station
    mapRef.current?.animateToRegion(
      {
        latitude: station.lat,
        longitude: station.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handleLayerToggle = () => {
    const modes: MapViewMode[] = ["standard", "satellite", "hybrid"];
    const currentIndex = modes.indexOf(mapMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMapMode(modes[nextIndex]);
  };

  const handleScooterMode = () => {
    setSelectedFilter("station");
  };

  const handleMyLocation = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: 10.8454,
        longitude: 106.8232,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
  };

  const getMarkerColor = (station: Station): string => {
    switch (station.type) {
      case "station":
        return station.available > 0
          ? styleTokens.colors.success
          : styleTokens.colors.danger;
      case "dealer":
        return styleTokens.colors.primary;
      case "service":
        return "#FF9800";
      default:
        return styleTokens.colors.muted;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 10.8454,
          longitude: 106.8232,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        mapType={mapMode}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.lat,
              longitude: station.lng,
            }}
            onPress={() => handleMarkerPress(station)}
          >
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor: getMarkerColor(station),
                  borderColor:
                    selectedStation?.id === station.id
                      ? "white"
                      : "transparent",
                  borderWidth: selectedStation?.id === station.id ? 3 : 0,
                },
              ]}
            >
              <Text style={styles.markerText}>
                {station.type === "station"
                  ? "🔋"
                  : station.type === "dealer"
                  ? "🏪"
                  : "🔧"}
              </Text>
              {station.available > 0 && (
                <View style={styles.markerBadge}>
                  <Text style={styles.markerBadgeText}>
                    {station.available}
                  </Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Filter Chips */}
      <FilterChips
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Floating Actions */}
      <FloatingActions
        onLayerToggle={handleLayerToggle}
        onScooterMode={handleScooterMode}
        onMyLocation={handleMyLocation}
        mapMode={mapMode}
      />

      {/* List Toggle FAB */}
      <TouchableOpacity
        style={styles.listToggleFab}
        onPress={() => setShowList(!showList)}
        activeOpacity={0.8}
      >
        <Text style={styles.listToggleText}>
          {showList ? "Xem bản đồ" : "Xem danh sách"}
        </Text>
      </TouchableOpacity>

      {/* QR Scan FAB */}
      <TouchableOpacity
        style={styles.qrScanFab}
        // @ts-ignore
        onPress={() => navigation.navigate("QRScan")}
        activeOpacity={0.8}
      >
        <Text style={styles.qrScanIcon}>📷</Text>
      </TouchableOpacity>

      {/* Bottom Sheet - Simple Implementation */}
      {showList && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />

          <ScrollView style={styles.bottomSheetContent}>
            {/* Selected Station Highlight */}
            {selectedStation && (
              <View style={styles.selectedStationContainer}>
                <Text style={styles.selectedStationTitle}>Trạm được chọn</Text>
                <StationCard
                  station={selectedStation}
                  isSelected={true}
                  onPress={() => handleCardPress(selectedStation)}
                />
              </View>
            )}

            {/* Station List */}
            <View style={styles.stationList}>
              <Text style={styles.listTitle}>
                Tất cả trạm ({filteredStations.length})
              </Text>
              {filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={selectedStation?.id === station.id}
                  onPress={() => handleCardPress(station)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  markerText: {
    fontSize: 16,
  },
  markerBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: styleTokens.colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  markerBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  listToggleFab: {
    position: "absolute",
    bottom: 120,
    right: styleTokens.padding,
    backgroundColor: styleTokens.colors.bg,
    paddingHorizontal: styleTokens.padding,
    paddingVertical: styleTokens.spacing.md,
    borderRadius: 25,
    ...styleTokens.shadow,
    zIndex: 1000,
  },
  listToggleText: {
    color: styleTokens.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: styleTokens.colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...styleTokens.shadow,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: styleTokens.colors.muted,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: styleTokens.spacing.md,
  },
  bottomSheetContent: {
    flex: 1,
    paddingBottom: 100,
  },
  selectedStationContainer: {
    marginBottom: styleTokens.spacing.lg,
  },
  selectedStationTitle: {
    ...styleTokens.typography.headline,
    paddingHorizontal: styleTokens.padding,
    marginBottom: styleTokens.spacing.sm,
  },
  stationList: {
    flex: 1,
  },
  listTitle: {
    ...styleTokens.typography.headline,
    paddingHorizontal: styleTokens.padding,
    marginBottom: styleTokens.spacing.sm,
    color: styleTokens.colors.muted,
  },
  qrScanFab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: styleTokens.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  qrScanIcon: {
    fontSize: 24,
  },
});
