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
      {/* <View style={styles.searchContainer}>
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
      </View> */}

      {/* Account Info */}
      <View style={styles.creditsContainer}>
        <View style={styles.creditsCard}>
          {/* <View style={styles.creditsHeaderSection}>
              <Text style={styles.creditsMainTitle}>Tình hình tài khoản</Text>
            </View> */}

          <View style={styles.transactionTypesContainer}>
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Lượt Đổi Lẻ</Text>
              <Text style={styles.walletAmount}>10 lượt</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Lượt Đổi Gói</Text>
              <Text style={styles.walletAmount}>100 lượt</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.financialCenterButton}
            onPress={() => {
              navigation.getParent()?.navigate("AccountDetails");
            }}
          >
            <View style={styles.financialCenterContent}>
              {/* <View style={styles.financialIconContainer}>
                <Text style={styles.financialIcon}>💳</Text>
              </View> */}
              <Text style={styles.financialCenterText}>Quản Lý Lượt Đổi</Text>
              <Text style={styles.financialArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#b0d4b8",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
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
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000000",
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
  // Credits/Account section
  creditsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  creditsCard: {
    backgroundColor: "#5d7b6f",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  creditsHeaderSection: {
    marginBottom: 16,
  },
  creditsMainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
  },
  transactionTypesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  walletItem: {
    flex: 1,
    // backgroundColor: "#f8f8f8",
    // borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: "center",
    minHeight: 44,
    maxHeight: 44,
  },
  highlightWallet: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#5D7B6F",
  },
  walletLabel: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    textAlign: "center",
  },
  walletAmountHighlight: {
    fontSize: 10,
    color: "#FF6B9D",
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
  },
  financialCenterButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  financialCenterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  financialIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#5D7B6F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  financialIcon: {
    fontSize: 16,
    color: "#ffffff",
  },
  financialCenterText: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "600",
    flex: 1,
  },
  financialArrow: {
    fontSize: 16,
    color: "#5D7B6F",
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
    backgroundColor: "#ffffff",
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
    color: "#000000",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: "#666666",
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
    color: "#000000",
    marginBottom: 2,
  },
  batteryTypes: {
    fontSize: 12,
    color: "#666666",
  },
  stationActions: {
    flexDirection: "row",
    gap: 8,
  },
  detailButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailButtonText: {
    color: "#000000",
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
    backgroundColor: "#cccccc",
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
    color: "#666666",
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
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
