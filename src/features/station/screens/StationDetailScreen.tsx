import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../theme";

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableBatteries: number;
  totalBatteries: number;
  operatingHours: string;
  image: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function StationDetailScreen({ route }: any) {
  const { stationId } = route.params;

  // Mock data - replace with actual API call
  const station: Station = {
    id: stationId,
    name: "Vinhomes Grand Park, khu 12",
    address: "Vinhomes Grand Park, Quận 9, TP.HCM",
    distance: "0.8 km",
    availableBatteries: 86,
    totalBatteries: 88,
    operatingHours: "24/7",
    image: "https://via.placeholder.com/400x200",
    amenities: [
      "Wifi miễn phí",
      "Toilet",
      "Máy lạnh",
      "Camera an ninh",
      "Gửi xe miễn phí",
    ],
    coordinates: {
      lat: 10.8454,
      lng: 106.8232,
    },
  };

  const handleReserve = () => {
    // Navigate to ReservationScreen
    console.log("Navigate to reservation");
  };

  const handleDirections = () => {
    // Open Google Maps for directions
    console.log("Open directions");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: station.image }} style={styles.stationImage} />
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Hoạt động</Text>
          </View>
        </View>

        {/* Station Info */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.stationName, { color: theme.colors.text.primary }]}
          >
            {station.name}
          </Text>
          <Text
            style={[styles.address, { color: theme.colors.text.secondary }]}
          >
            📍 {station.address}
          </Text>
          <Text style={[styles.distance, { color: theme.colors.primary }]}>
            🚶‍♂️ {station.distance} từ vị trí của bạn
          </Text>

          {/* Battery Status */}
          <View style={styles.batteryContainer}>
            <View style={styles.batteryStatus}>
              <Text
                style={[styles.batteryCount, { color: theme.colors.success }]}
              >
                {station.availableBatteries}
              </Text>
              <Text
                style={[
                  styles.batteryLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Pin sẵn sàng
              </Text>
            </View>
            <View style={styles.batteryStatus}>
              <Text
                style={[
                  styles.batteryCount,
                  { color: theme.colors.text.primary },
                ]}
              >
                {station.totalBatteries}
              </Text>
              <Text
                style={[
                  styles.batteryLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Tổng pin
              </Text>
            </View>
            <View style={styles.batteryStatus}>
              <Text
                style={[
                  styles.batteryCount,
                  { color: theme.colors.text.primary },
                ]}
              >
                {station.operatingHours}
              </Text>
              <Text
                style={[
                  styles.batteryLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Giờ hoạt động
              </Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Tiện ích
            </Text>
            {station.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>✓</Text>
                <Text
                  style={[
                    styles.amenityText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {amenity}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleReserve}
            >
              <Text style={styles.primaryButtonText}>Đặt trạm ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.outlineButton,
                { borderColor: theme.colors.primary },
              ]}
              onPress={handleDirections}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  { color: theme.colors.primary },
                ]}
              >
                Chỉ đường
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  stationImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#28c76f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 20,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    marginBottom: 24,
  },
  batteryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  batteryStatus: {
    alignItems: "center",
  },
  batteryCount: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  batteryLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  amenitiesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amenityIcon: {
    color: "#28c76f",
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  amenityText: {
    fontSize: 16,
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
