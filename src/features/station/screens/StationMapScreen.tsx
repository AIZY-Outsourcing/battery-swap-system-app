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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Components
import FilterChips from "../../../components/FilterChips";
import FloatingActions from "../../../components/FloatingActions";
import StationCard from "../../../components/StationCard";
import BottomSheetHandle from "../../../components/BottomSheetHandle";

// Data & Utils
import { stations } from "../../../data/stations";
import { useTranslation } from "react-i18next";
import { Station, FilterType, MapViewMode } from "../../../types/station";
import { distanceKm, formatDistance } from "../../../utils/geo";
import { styleTokens } from "../../../styles/tokens";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function StationMapScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
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
  const [sheetIndex, setSheetIndex] = useState(0); // track current bottom sheet index

  // Bottom sheet snap points
  const snapPoints = ["15%", "45%", "85%", "100%"]; // added full height

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
    setSelectedFilter("station");
    Alert.alert(t("map.scooterMode.title"), t("map.scooterMode.message"));
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
    setSheetIndex(index);
    setIsBottomSheetExpanded(index >= 2); // expanded for 85% or 100%
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
      <StatusBar
        barStyle="light-content"
        backgroundColor={styleTokens.colors.bg}
      />

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
              <MaterialCommunityIcons
                name={
                  station.type === "station"
                    ? "battery-charging-medium"
                    : station.type === "dealer"
                    ? "store-outline"
                    : "wrench-outline"
                }
                size={20}
                color={styleTokens.colors.white}
              />
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

      {/* Floating Actions (hide at 85% and 100% -> indices >=2) */}
      {sheetIndex < 2 && (
        <FloatingActions
          onLayerToggle={handleLayerToggle}
          // onScooterMode={handleScooterMode}
          onMyLocation={handleMyLocation}
          mapMode={mapMode}
        />
      )}

      {/* List Toggle FAB */}
      {/* <TouchableOpacity
        style={[
          styles.listToggleFab,
          {
            top: insets.top + 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          },
        ]}
        onPress={handleListToggle}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={isBottomSheetExpanded ? "map" : "format-list-bulleted"}
          size={18}
          color={styleTokens.colors.white}
        />
        <Text style={styles.listToggleText}>
          {isBottomSheetExpanded ? t("map.toggle.map") : t("map.toggle.list")}
        </Text>
      </TouchableOpacity> */}

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
              <Text style={styles.selectedStationTitle}>
                {t("map.selectedStation")}
              </Text>
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
              {t("map.allStations")} ({filteredStations.length})
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
    backgroundColor: styleTokens.colors.neutral, // lighter gray background requested
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
    right: styleTokens.padding,
    backgroundColor: styleTokens.colors.card,
    paddingHorizontal: styleTokens.spacing.lg,
    paddingVertical: styleTokens.spacing.sm + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: styleTokens.colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 1000,
  },
  listToggleText: {
    color: styleTokens.colors.white,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bottomSheetBackground: {
    backgroundColor: "#f1f5f9", // light gray similar to profile tab background
    borderTopLeftRadius: styleTokens.radius,
    borderTopRightRadius: styleTokens.radius,
  },
  bottomSheetContent: {
    paddingBottom: 100,
    backgroundColor: "#f1f5f9",
  },
  selectedStationContainer: {
    marginBottom: styleTokens.spacing.lg,
  },
  selectedStationTitle: {
    ...styleTokens.typography.headline,
    paddingHorizontal: styleTokens.padding,
    marginBottom: styleTokens.spacing.sm,
    color: styleTokens.colors.textDark,
  },
  stationList: {
    flex: 1,
    paddingTop: styleTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  listTitle: {
    ...styleTokens.typography.subtitle,
    paddingHorizontal: styleTokens.padding,
    marginBottom: styleTokens.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: styleTokens.colors.textMuted,
    fontWeight: "500",
  },
});
