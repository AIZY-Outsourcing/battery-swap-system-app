import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as VehicleService from "../../../services/api/VehicleService";

type Props = NativeStackScreenProps<AppStackParamList, "VehicleDetail">;

interface Vehicle {
  id: string;
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year?: string;
  battery_type_id?: string;
  vehicle_model_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default function VehicleDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleDetail();
  }, [vehicleId]);

  const fetchVehicleDetail = async () => {
    try {
      const response = await VehicleService.getVehicleById(vehicleId);
      if (response.success && response.data) {
        setVehicle(response.data);
      } else {
        Alert.alert(
          t("common.error"),
          response.error?.message || t("vehicle.error.loadInfo")
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      Alert.alert(t("common.error"), t("vehicle.error.loadInfo"));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t("vehicle.delete.confirmTitle"),
      t("vehicle.delete.confirmMessage", { name: vehicle?.name }),
      [
        { text: t("vehicle.delete.cancel"), style: "cancel" },
        {
          text: t("vehicle.delete.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const response = await VehicleService.deleteVehicle(vehicleId);
              if (response.success) {
                Alert.alert(t("common.success"), t("vehicle.delete.success"), [
                  {
                    text: t("common.ok"),
                    onPress: () => navigation.goBack(),
                  },
                ]);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="car-off" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>{t("vehicle.detail.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="car-electric"
              size={48}
              color="#10b981"
            />
          </View>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehiclePlate}>{vehicle.plate_number}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("vehicle.detail.info")}</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons
                name="barcode"
                size={20}
                color="#64748b"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.detailValue}>{vehicle.vin}</Text>
            </View>
          </View>

          {vehicle.manufacturer_year && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#64748b"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {t("vehicle.add.manufacturerYear")}
                </Text>
                <Text style={styles.detailValue}>
                  {vehicle.manufacturer_year}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons
                name="card-text-outline"
                size={20}
                color="#64748b"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {t("vehicle.add.plateNumber")}
              </Text>
              <Text style={styles.detailValue}>{vehicle.plate_number}</Text>
            </View>
          </View>
        </View>

        {/* Metadata Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("vehicle.detail.systemInfo")}
          </Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#64748b"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {t("vehicle.detail.createdAt")}
              </Text>
              <Text style={styles.detailValue}>
                {formatDate(vehicle.created_at)}
              </Text>
            </View>
          </View>

          {vehicle.updated_at && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialCommunityIcons
                  name="update"
                  size={20}
                  color="#64748b"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {t("vehicle.detail.updatedAt")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatDate(vehicle.updated_at)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditVehicle", { vehicleId: vehicle.id })
            }
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#ffffff" />
            <Text style={styles.editButtonText}>
              {t("vehicle.detail.edit")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialCommunityIcons name="delete" size={20} color="#ffffff" />
            <Text style={styles.deleteButtonText}>
              {t("vehicle.detail.delete")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  vehiclePlate: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10b981",
    letterSpacing: 2,
  },
  section: {
    backgroundColor: "#ffffff",
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailIcon: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
