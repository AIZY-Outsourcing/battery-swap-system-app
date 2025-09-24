import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Components
import FilterChips from "../../../components/FilterChips";
import FloatingActions from "../../../components/FloatingActions";
import StationCard from "../../../components/StationCard";
import BottomSheetHandle from "../../../components/BottomSheetHandle";

// Data & Utils
import { stations } from "../../../data/stations";
import { Station, FilterType, MapViewMode } from "../../../types/station";
import { distanceKm, formatDistance } from "../../../utils/geo";
import { styleTokens } from "../../../styles/tokens";

const { width, height } = Dimensions.get("window");

export default function StationMapScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // State
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapMode, setMapMode] = useState<MapViewMode>("standard");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredStations, setFilteredStations] = useState<Station[]>(stations);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  // Bottom sheet snap points
  const snapPoints = ["15%", "45%", "85%"];

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    filterStations();
  }, [selectedFilter, userLocation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const filterStations = () => {
    let filtered = stations;

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = stations.filter((station) => station.type === selectedFilter);
    }

    // Calculate distances if user location available
    if (userLocation) {
      filtered = filtered
        .map((station) => ({
          ...station,
          distanceKm: distanceKm(
            userLocation.lat,
            userLocation.lng,
            station.lat,
            station.lng
          ),
        }))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    setFilteredStations(filtered);
  };

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

    // Expand bottom sheet to middle position
    bottomSheetRef.current?.snapToIndex(1);
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
    // Filter to show only stations with available batteries
    setSelectedFilter("station");
    Alert.alert("Chế độ xe máy", "Hiển thị chỉ các trạm sạc có pin sẵn sàng");
  };

  const handleMyLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    } else {
      requestLocationPermission();
    }
  };

  const handleListToggle = () => {
    const isExpanded = !isBottomSheetExpanded;
    setIsBottomSheetExpanded(isExpanded);
    bottomSheetRef.current?.snapToIndex(isExpanded ? 2 : 0);
  };

  const handleSheetChanges = (index: number) => {
    setIsBottomSheetExpanded(index === 2);
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
    <GestureHandlerRootView style={styles.container}>
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
        showsCompass={false}
        toolbarEnabled={false}
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
        onPress={handleListToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.listToggleText}>
          {isBottomSheetExpanded ? "Xem bản đồ" : "Xem danh sách"}
        </Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={BottomSheetHandle}
        enablePanDownToClose={false}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
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
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
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
  bottomSheetBackground: {
    backgroundColor: styleTokens.colors.bg,
  },
  bottomSheetContent: {
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
});
