import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard } from "../../../components";
import { mockData } from "../../../data/mockData";
import { Station } from "../../../data/mockData";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = 200;
const CARD_WIDTH = width * 0.85;

export default function MapScreen({ navigation }: any) {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Animation for card carousel
  const scrollX = useRef(new Animated.Value(0)).current;

  // Hanoi coordinates (center of the city)
  const initialRegion = {
    latitude: 21.0285,
    longitude: 105.8542,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const getMarkerColor = (status: Station["status"]) => {
    switch (status) {
      case "available":
        return "#4CAF50"; // Green
      case "busy":
        return "#FF9800"; // Orange
      case "maintenance":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  const getStatusText = (status: Station["status"]) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "busy":
        return "Đang bận";
      case "maintenance":
        return "Bảo trì";
      default:
        return "Offline";
    }
  };

  const onMarkerPress = (station: Station, index: number) => {
    setSelectedStation(station);
    // Animate to selected station
    mapRef.current?.animateToRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    // Scroll to corresponding card
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
  };

  const onCardPress = (station: Station) => {
    mapRef.current?.animateToRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const renderStationCard = (station: Station, index: number) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={station.id}
        style={[
          styles.card,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onCardPress(station)}
        >
          <ThemedCard style={styles.cardContent}>
            {/* Status Header */}
            <View
              style={[
                styles.statusHeader,
                { backgroundColor: getMarkerColor(station.status) },
              ]}
            >
              <View style={styles.statusContent}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.statusText}>
                  {getStatusText(station.status)}
                </Text>
              </View>
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>{station.distance}km</Text>
                <Text style={styles.etaText}>
                  {station.estimatedTravelTime} phút
                </Text>
              </View>
            </View>

            {/* Station Info */}
            <View style={styles.stationInfo}>
              <Text
                style={[styles.address, { color: theme.colors.text.secondary }]}
              >
                📍 {station.address}
              </Text>

              {/* Operating Hours */}
              <View style={styles.hoursContainer}>
                <Text
                  style={[
                    styles.hoursLabel,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  Giờ mở cửa:
                </Text>
                <Text
                  style={[
                    styles.hoursText,
                    {
                      color: station.isOpen
                        ? theme.colors.success
                        : theme.colors.error,
                    },
                  ]}
                >
                  {station.operatingHours.open} - {station.operatingHours.close}
                </Text>
              </View>

              {/* Battery Availability */}
              <View style={styles.batteryRow}>
                <Text
                  style={[
                    styles.batteryLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  ⚡ Có sẵn:{" "}
                  {station.availableBatteries.A +
                    station.availableBatteries.B +
                    station.availableBatteries.C}
                  /88
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => navigation.navigate("Stations")}
                >
                  <Text style={styles.actionButtonText}>📍 Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                  onPress={() => navigation.navigate("Stations")}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    📱 Gọi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {mockData.stations.map((station, index) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => onMarkerPress(station, index)}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(station.status) },
              ]}
            >
              <Text style={styles.markerText}>⚡</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>⚡ Trạm sạc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>🏢 Đại lý</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>🔧 Xưởng dịch vụ</Text>
        </TouchableOpacity>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: theme.colors.surface.default },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.controlIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: theme.colors.surface.default },
          ]}
        >
          <Text style={styles.controlIcon}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: theme.colors.surface.default },
          ]}
        >
          <Text style={styles.controlIcon}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: theme.colors.surface.default },
          ]}
        >
          <Text style={styles.controlIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Card Carousel */}
      <View style={styles.cardCarousel}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={styles.cardContainer}
        >
          {mockData.stations.map((station, index) =>
            renderStationCard(station, index)
          )}
        </ScrollView>
      </View>

      {/* Map View Button */}
      <TouchableOpacity
        style={[
          styles.mapViewButton,
          { backgroundColor: theme.colors.text.primary },
        ]}
        onPress={() => navigation.navigate("Stations")}
      >
        <Text style={styles.mapViewButtonText}>🗺️ Xem bản đồ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  filterTabs: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  activeTabText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  tabText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  controls: {
    position: "absolute",
    right: 20,
    top: "45%",
    alignItems: "center",
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlIcon: {
    fontSize: 18,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 16,
    color: "white",
  },
  cardCarousel: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
  },
  cardContainer: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 8,
  },
  cardContent: {
    flex: 1,
    overflow: "hidden",
  },
  statusHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContent: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  distanceContainer: {
    alignItems: "flex-end",
  },
  distanceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  etaText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  stationInfo: {
    padding: 16,
    flex: 1,
  },
  address: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hoursLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  hoursText: {
    fontSize: 12,
    fontWeight: "600",
  },
  batteryRow: {
    marginBottom: 12,
  },
  batteryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  mapViewButton: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  mapViewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
