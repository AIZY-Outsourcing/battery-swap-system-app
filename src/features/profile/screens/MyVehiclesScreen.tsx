import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as VehicleService from "../../../services/api/VehicleService";

type Props = NativeStackScreenProps<AppStackParamList, "MyVehicles">;

interface Vehicle {
  id: string;
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year?: string;
  battery_type_id?: string;
  vehicle_model_id?: string;
  created_at?: string;
}

export default function MyVehiclesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await VehicleService.getMyVehicles();
      if (response.success && response.data) {
        setVehicles(response.data);
      } else {
        Alert.alert(
          t("common.error"),
          response.error?.message || t("vehicle.error.loadFailed")
        );
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      Alert.alert(t("common.error"), t("vehicle.error.loadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    Alert.alert(
      t("vehicle.delete.confirmTitle"),
      t("vehicle.delete.confirmMessage", { name: vehicleName }),
      [
        { text: t("vehicle.delete.cancel"), style: "cancel" },
        {
          text: t("vehicle.delete.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const response = await VehicleService.deleteVehicle(vehicleId);
              if (response.success) {
                Alert.alert(t("common.success"), t("vehicle.delete.success"));
                fetchVehicles();
              } else {
                Alert.alert(
                  t("common.error"),
                  response.error?.message || t("vehicle.error.deleteFailed")
                );
              }
            } catch (error) {
              console.error("Error deleting vehicle:", error);
              Alert.alert(t("common.error"), t("vehicle.error.deleteFailed"));
            }
          },
        },
      ]
    );
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() =>
        navigation.navigate("VehicleDetail", { vehicleId: item.id })
      }
      activeOpacity={0.7}
    >
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIcon}>
          <MaterialCommunityIcons
            name="car-electric"
            size={24}
            color="#10b981"
          />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehiclePlate}>{item.plate_number}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteVehicle(item.id, item.name)}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color="#ef4444"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.vehicleDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="barcode" size={16} color="#64748b" />
          <Text style={styles.detailText}>VIN: {item.vin}</Text>
        </View>
        {item.manufacturer_year && (
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              {t("vehicle.year")}: {item.manufacturer_year}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="car-off" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>{t("vehicle.empty.title")}</Text>
      <Text style={styles.emptySubtitle}>{t("vehicle.empty.subtitle")}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D7B6F" />
          <Text style={styles.loadingText}>{t("vehicle.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          vehicles.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5D7B6F"]}
            tintColor="#5D7B6F"
          />
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate("AddVehicle")}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
    letterSpacing: 1,
  },
  deleteButton: {
    padding: 8,
  },
  vehicleDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  addButton: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5D7B6F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
