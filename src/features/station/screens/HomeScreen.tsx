import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard, ThemedButton } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";
import { CompositeScreenProps } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useStations } from "../hooks/useStations";
import StationCard from "../../../components/StationCard";
import { useAuthStore } from "../../../store/authStore";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

type DistanceOpt = 5 | 10 | 20;
type BatteryOpt = "A" | "B" | "C" | "";
type SortOpt = "nearest" | "rating";

type Props = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
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
    <View style={{ marginBottom: 12 }}>
      <StationCard
        station={item}
        onPress={() =>
          navigation
            .getParent()
            ?.navigate("StationDetails", { stationId: String(item.id) })
        }
      />
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 20,
          marginTop: 6,
        }}
      >
        <ThemedButton
          title="Chi tiết"
          size="sm"
          variant="secondary"
          onPress={() =>
            navigation
              .getParent()
              ?.navigate("StationDetails", { stationId: String(item.id) })
          }
        />
        <ThemedButton
          title={credits > 0 ? "Đặt trước" : "Hết lượt"}
          size="sm"
          variant="primary"
          disabled={credits <= 0 || item.available <= 0}
          onPress={() =>
            navigation
              .getParent()
              ?.navigate("ReservationConfirm", { stationId: String(item.id) })
          }
        />
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
    >
      {/* Header với Search và Map Button */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Trạm đổi pin 🔋</Text>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm trạm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.secondary}
          />
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              // @ts-ignore - We'll fix navigation types later
              navigation.getParent()?.navigate("StationMap");
            }}
          >
            <Text style={styles.mapButtonText}>🗺️</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
        <LoadingSpinner text="Đang tải danh sách trạm..." />
      ) : isError ? (
        <ThemedCard style={styles.emptyCard}>
          <Text
            style={[styles.emptyText, { color: theme.colors.text.secondary }]}
          >
            Không tải được danh sách. Kiểm tra mạng và thử lại.
          </Text>
          <ThemedButton
            title="Thử lại"
            onPress={() => refetch()}
            variant="primary"
          />
        </ThemedCard>
      ) : (
        <FlatList
          data={stations}
          renderItem={renderStationCard}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.stationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <ThemedCard style={styles.emptyCard}>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Không có trạm phù hợp
              </Text>
            </ThemedCard>
          )}
        />
      )}

      {/* FAB: open Map screen */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 28,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onPress={() => navigation.getParent()?.navigate("StationMap")}
        accessibilityRole="button"
        accessibilityLabel="Mở bản đồ"
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Bản đồ 🗺️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  mapButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    padding: 20,
    paddingTop: 0,
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 12,
  },
  stationStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  batteryTypes: {
    fontSize: 12,
  },
  emptyCard: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
