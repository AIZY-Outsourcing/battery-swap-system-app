import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";

const { width, height } = Dimensions.get("window");

interface StationType {
  id: string;
  name: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: "charging" | "agent" | "service";
  status: "available" | "busy" | "maintenance";
  availableBatteries?: number;
  totalBatteries?: number;
  isOpen24h: boolean;
  distance: string;
}

const STATION_DATA: StationType[] = [
  {
    id: "1",
    name: "Vinhomes Grand Park, khu 12",
    address: "Vinhomes Grand Park, khu 12",
    coordinate: { latitude: 10.8454, longitude: 106.8232 },
    type: "charging",
    status: "available",
    availableBatteries: 86,
    totalBatteries: 88,
    isOpen24h: true,
    distance: "0.5 km",
  },
  {
    id: "2",
    name: "Vinschool Quận 9, trường Phố thông trung học",
    address: "Khu nhà xe ngoài trời, trường Phố thông trung học",
    coordinate: { latitude: 10.8484, longitude: 106.8262 },
    type: "charging",
    status: "maintenance",
    availableBatteries: 0,
    totalBatteries: 45,
    isOpen24h: true,
    distance: "0.8 km",
  },
  {
    id: "3",
    name: "Vinschool Quận 9 - Trường mầm non",
    address: "Đường Nguyễn Xiển, Phường Long Bình",
    coordinate: { latitude: 10.8424, longitude: 106.8202 },
    type: "charging",
    status: "maintenance",
    availableBatteries: 0,
    totalBatteries: 32,
    isOpen24h: true,
    distance: "1.2 km",
  },
  {
    id: "4",
    name: "Coco Mart",
    address: "Đường Nguyễn Xiển",
    coordinate: { latitude: 10.8494, longitude: 106.8172 },
    type: "agent",
    status: "available",
    isOpen24h: false,
    distance: "1.5 km",
  },
  {
    id: "5",
    name: "Công viên Grand Park",
    address: "Khu vực trung tâm",
    coordinate: { latitude: 10.8504, longitude: 106.8192 },
    type: "service",
    status: "available",
    isOpen24h: false,
    distance: "1.8 km",
  },
];

const FILTER_TABS = [
  { id: "all", title: "Tất cả", icon: "📍" },
  { id: "charging", title: "Trạm sạc", icon: "🔋" },
  { id: "agent", title: "Đại lý", icon: "🏪" },
  { id: "service", title: "Xưởng dịch vụ", icon: "🔧" },
];

export default function NearbyStationsScreen() {
  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;

  const filteredStations = STATION_DATA.filter((station) => {
    if (selectedFilter === "all") return true;
    return station.type === selectedFilter;
  });

  useEffect(() => {
    // Animate bottom sheet in
    Animated.spring(bottomSheetAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();
  }, []);

  const getMarkerColor = (station: StationType) => {
    switch (station.type) {
      case "charging":
        return station.status === "available"
          ? theme.colors.success
          : theme.colors.error;
      case "agent":
        return theme.colors.secondary;
      case "service":
        return theme.colors.primaryLight;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getStatusText = (station: StationType) => {
    if (station.type === "charging") {
      if (station.status === "available") {
        return `Còn sạc sẵn sàng: ${station.availableBatteries}/${station.totalBatteries}`;
      } else {
        return "Bảo trì";
      }
    }
    return station.isOpen24h ? "Mở 24/7" : "Có giới hạn giờ";
  };

  const getStationTypeText = (type: string) => {
    switch (type) {
      case "charging":
        return "Trạm công cộng - Gửi xe miễn phí";
      case "agent":
        return "Đại lý - Gửi xe tính phí";
      case "service":
        return "Xưởng dịch vụ - Sửa chữa";
      default:
        return "Khác";
    }
  };

  const onMarkerPress = (station: StationType, index: number) => {
    setSelectedStation(station.id);
    // Focus map on selected station
    mapRef.current?.animateToRegion({
      ...station.coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    // Scroll to corresponding card
    const cardWidth = width * 0.8;
    const cardMargin = 16;
    const scrollX = index * (cardWidth + cardMargin);
    scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
  };

  const onCardPress = (station: StationType) => {
    mapRef.current?.animateToRegion({
      ...station.coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setSelectedStation(station.id);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa điểm</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <View
        style={[
          styles.filterContainer,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    selectedFilter === tab.id
                      ? theme.colors.secondary
                      : theme.colors.tertiary,
                },
              ]}
              onPress={() => setSelectedFilter(tab.id)}
            >
              <Text style={styles.filterIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedFilter === tab.id
                        ? theme.colors.text.white
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
        showsUserLocation
        showsMyLocationButton
      >
        {filteredStations.map((station, index) => (
          <Marker
            key={station.id}
            coordinate={station.coordinate}
            onPress={() => onMarkerPress(station, index)}
          >
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor: getMarkerColor(station),
                  borderColor:
                    selectedStation === station.id ? "#FFFFFF" : "transparent",
                  borderWidth: selectedStation === station.id ? 3 : 0,
                },
              ]}
            >
              <Text style={styles.markerText}>
                {station.type === "charging"
                  ? "🔋"
                  : station.type === "agent"
                  ? "🏪"
                  : "🔧"}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: theme.colors.surface.default,
            transform: [
              {
                translateY: bottomSheetAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.bottomSheetHandle} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stationCardsContainer}
          style={styles.stationCards}
        >
          {filteredStations.map((station, index) => (
            <TouchableOpacity
              key={station.id}
              style={[
                styles.stationCard,
                {
                  backgroundColor:
                    selectedStation === station.id
                      ? theme.colors.accent
                      : theme.colors.background.primary,
                  borderColor:
                    selectedStation === station.id
                      ? theme.colors.secondary
                      : theme.colors.border.default,
                },
              ]}
              onPress={() => onCardPress(station)}
            >
              <Text
                style={[
                  styles.stationName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {station.name}
              </Text>
              <Text
                style={[
                  styles.stationAddress,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {station.address}
              </Text>

              <View style={styles.stationInfo}>
                <Text
                  style={[
                    styles.stationType,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {getStationTypeText(station.type)}
                </Text>
                <Text
                  style={[styles.openHours, { color: theme.colors.success }]}
                >
                  Mở: 24/7
                </Text>
              </View>

              <Text
                style={[
                  styles.stationStatus,
                  {
                    color:
                      station.status === "available"
                        ? theme.colors.success
                        : theme.colors.error,
                  },
                ]}
              >
                🔋 {getStatusText(station)}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.directionButton,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                >
                  <Text style={styles.directionText}>🧭</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.navigateButton,
                    { backgroundColor: theme.colors.primaryLight },
                  ]}
                >
                  <Text style={styles.navigateText}>📍</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map Toggle Button */}
        <TouchableOpacity
          style={[
            styles.mapToggleButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={styles.mapToggleIcon}>🗺️</Text>
          <Text style={styles.mapToggleText}>Xem bản đồ</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  markerText: {
    fontSize: 16,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  stationCards: {
    paddingHorizontal: 16,
  },
  stationCardsContainer: {
    paddingRight: 16,
  },
  stationCard: {
    width: width * 0.8,
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  stationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stationType: {
    fontSize: 12,
  },
  openHours: {
    fontSize: 12,
    color: "#4CAF50",
  },
  stationStatus: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  directionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  directionText: {
    fontSize: 16,
  },
  navigateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navigateText: {
    fontSize: 16,
  },
  mapToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
  },
  mapToggleIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mapToggleText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
