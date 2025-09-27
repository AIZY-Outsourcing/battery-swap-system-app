import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useStations } from "../hooks/useStations";
import { useAuthStore } from "../../../store/authStore";

type DistanceOpt = 5 | 10 | 20;
type BatteryOpt = "A" | "B" | "C" | "";
type SortOpt = "nearest" | "rating";

type Props = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState<DistanceOpt>(10);
  const [batteryType, setBatteryType] = useState<BatteryOpt>("");
  const [sort, setSort] = useState<SortOpt>("nearest");
  const credits = useAuthStore((s) => s.user?.swapCredits ?? 0);

  const { data, isLoading, isError, refetch } = useStations({
    q: searchQuery,
    distance_km: distance,
    battery_type: batteryType || undefined,
    sort,
    enableDistanceCompute: true,
  });
  const stations = data || [];

  const renderStationCard = ({ item }: { item: any }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.name}</Text>
          <Text style={styles.stationAddress}>{item.address}</Text>
          <Text style={styles.stationDistance}>
            📍 {item.distance ? `${item.distance.toFixed(1)} km` : "N/A"}
          </Text>
        </View>
        <View style={styles.stationStatus}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.available > 0 ? "#22c55e" : "#ef4444",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.available > 0 ? "Có sẵn" : "Hết pin"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.stationStats}>
        <View style={styles.batteryInfo}>
          <Text style={styles.batteryCount}>
            🔋 {item.available}/{item.capacity}
          </Text>
          <Text style={styles.batteryTypes}>Pin A, B, C</Text>
        </View>
        <View style={styles.stationActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              navigation
                .getParent()
                ?.navigate("StationDetails", { stationId: String(item.id) })
            }
          >
            <Text style={styles.detailButtonText}>Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.reserveButton,
              (credits <= 0 || item.available <= 0) &&
                styles.reserveButtonDisabled,
            ]}
            disabled={credits <= 0 || item.available <= 0}
            onPress={() =>
              navigation
                .getParent()
                ?.navigate("ReservationConfirm", { stationId: String(item.id) })
            }
          >
            <Text style={styles.reserveButtonText}>
              {credits > 0 ? "Đặt trước" : "Hết lượt"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trạm đổi pin</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm trạm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888888"
        />
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => {
            navigation.getParent()?.navigate("StationMap");
          }}
        >
          <Text style={styles.mapButtonText}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter bar: distance, battery type, sort */}
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {([5, 10, 20] as DistanceOpt[]).map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.filterChip,
              distance === d && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setDistance(d)}
          >
            <Text style={styles.filterIcon}>📏</Text>
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    distance === d
                      ? theme.colors.surface.default
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {d} km
            </Text>
          </TouchableOpacity>
        ))}
        {(["", "A", "B", "C"] as BatteryOpt[]).map((b) => (
          <TouchableOpacity
            key={b || "all"}
            style={[
              styles.filterChip,
              batteryType === b && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setBatteryType(b)}
          >
            <Text style={styles.filterIcon}>🔋</Text>
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    batteryType === b
                      ? theme.colors.surface.default
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {b ? `Pin ${b}` : "Tất cả"}
            </Text>
          </TouchableOpacity>
        ))}
        {(["nearest", "rating"] as SortOpt[]).map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.filterChip,
              sort === s && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSort(s)}
          >
            <Text style={styles.filterIcon}>
              {s === "nearest" ? "📍" : "⭐"}
            </Text>
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    sort === s
                      ? theme.colors.surface.default
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {s === "nearest" ? "Gần nhất" : "Đánh giá"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Content states */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải danh sách trạm...</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Không tải được danh sách. Kiểm tra mạng và thử lại.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stations}
          renderItem={renderStationCard}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.stationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Không có trạm phù hợp</Text>
            </View>
          )}
        />
      )}

      {/* FAB: open Map screen */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.getParent()?.navigate("StationMap")}
        accessibilityRole="button"
        accessibilityLabel="Mở bản đồ"
      >
        <Text style={styles.fabText}>Bản đồ 🗺️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#ffffff",
  },
  mapButton: {
    backgroundColor: "#5D7B6F",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    fontSize: 20,
  },
  filterContainer: {
    backgroundColor: "transparent",
    paddingVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  stationsList: {
    padding: 16,
    paddingBottom: 100,
  },
  stationCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 12,
    color: "#5D7B6F",
  },
  stationStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  stationStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  batteryInfo: {
    flex: 1,
  },
  batteryCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  batteryTypes: {
    fontSize: 12,
    color: "#888888",
  },
  stationActions: {
    flexDirection: "row",
    gap: 8,
  },
  detailButton: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  reserveButton: {
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reserveButtonDisabled: {
    backgroundColor: "#666666",
  },
  reserveButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888888",
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#5D7B6F",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#5D7B6F",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
