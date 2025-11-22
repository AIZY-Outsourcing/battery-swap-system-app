import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  RootStackParamList,
} from "../../../navigation/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthService from "../../../services/auth/AuthService";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styleTokens } from "../../../styles/tokens";
import { useAuthStore } from "../../../store/authStore";
import subscriptionService, {
  UserSubscription,
} from "../../../services/api/SubscriptionService";
import {
  swapCreditsService,
  type SwapCredits,
} from "../../../services/api/SwapCreditsService";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

interface MenuItemDef {
  key: string;
  icon: string; // material community icon name
  label: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  danger?: boolean;
  badge?: string;
}

const MenuItem = ({ item }: { item: MenuItemDef }) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={item.toggle ? undefined : item.onPress}
      disabled={!!item.toggle}
    >
      <View style={styles.menuLeft}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={20}
          color={item.danger ? "#dc2626" : "#334155"}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuLabel, item.danger && styles.dangerText]}>
          {item.label}
        </Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      {item.toggle ? (
        <Switch
          value={item.toggleValue}
          onValueChange={item.onToggle}
          thumbColor={item.toggleValue ? styleTokens.colors.success : "#f4f4f5"}
          trackColor={{ false: "#cbd5e1", true: "#86efac" }}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color="#94a3b8"
        />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [swapCredits, setSwapCredits] = useState<SwapCredits | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [language, setLanguage] = useState<"vi" | "en">(
    i18n.language as "vi" | "en"
  );

  const activeSubscription = subscriptions.find((s) => s.status === "active");

  // Calculate TOTAL remaining swaps: single credits + subscription quota
  const totalSwaps =
    (swapCredits?.remaining_credits ?? 0) +
    (swapCredits?.total_remaining_quota_swaps ?? 0);

  // Load user subscriptions and swap credits
  useEffect(() => {
    loadSubscriptions();
    loadSwapCredits();
  }, []);

  const loadSwapCredits = async () => {
    try {
      setLoadingCredits(true);
      const response = await swapCreditsService.getMySwapCredits();
      if (response.success && response.data) {
        console.log("📊 [ProfileScreen] Swap credits loaded:", response.data);
        setSwapCredits(response.data);
      }
    } catch (error) {
      console.error("Error loading swap credits:", error);
    } finally {
      setLoadingCredits(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      const response = await subscriptionService.getMySubscriptions({
        limit: 10,
      });
      if (response.success && response.data) {
        console.log(
          "📊 [ProfileScreen] Subscriptions loaded:",
          response.data.data
        );
        setSubscriptions(response.data.data);

        const active = response.data.data.find(
          (s: UserSubscription) => s.status === "active"
        );
        console.log("✅ [ProfileScreen] Active subscription:", active);
        if (active) {
          console.log(
            "🔢 [ProfileScreen] Remaining swaps:",
            active.remaining_quota_swaps
          );
        }
      }
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  // Use real user data
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "User"
    : "User";
  const displayPhone = user?.phone || "";
  const displayEmail = user?.email || "";
  const userInitial =
    displayName && displayName.length > 0
      ? displayName.charAt(0).toUpperCase()
      : "U";
  const vehicle = user ? (user as any).vehicle : null;

  const handleLogout = () => {
    Alert.alert(
      t("logout"),
      t("confirm.logout", { defaultValue: "Bạn có chắc chắn muốn đăng xuất?" }),
      [
        { text: t("common.cancel", { defaultValue: "Hủy" }), style: "cancel" },
        {
          text: t("logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await AuthService.clearAuth();
              (navigation as any).getParent()?.reset({
                index: 0,
                routes: [{ name: "AuthStack" }],
              });
            } catch (error) {
              Alert.alert(
                t("error.title", { defaultValue: "Lỗi" }),
                t("error.logout", {
                  defaultValue: "Không thể đăng xuất. Vui lòng thử lại.",
                })
              );
            }
          },
        },
      ]
    );
  };

  const devAlert = () =>
    Alert.alert(t("profile.developingTitle"), t("profile.developingMessage"));
  const accountMenu: MenuItemDef[] = useMemo(
    () => [
      {
        key: "vehicles",
        icon: "car-multiple",
        label: t("vehicle.management"),
        onPress: () => navigation.navigate("MyVehicles"),
      },
      {
        key: "guide",
        icon: "book-open-page-variant",
        label: t("profile.guide"),
        onPress: () => navigation.navigate("Guide"),
      },
      {
        key: "faq",
        icon: "help-circle-outline",
        label: t("profile.faq"),
        onPress: () => navigation.navigate("FAQ"),
      },
      {
        key: "terms",
        icon: "file-document-outline",
        label: t("profile.terms"),
        onPress: () => navigation.navigate("Terms"),
      },
    ],
    [t, navigation]
  );
  const supportMenu: MenuItemDef[] = useMemo(
    () => [
      {
        key: "helpcenter",
        icon: "headset",
        label: t("profile.helpCenter"),
        onPress: () => navigation.navigate("HelpCenter"),
      },
      {
        key: "support",
        icon: "message-question-outline",
        label: t("profile.supportRequest"),
        onPress: () => navigation.navigate("SupportRequest"),
      },
    ],
    [t, navigation]
  );
  const legalMenu: MenuItemDef[] = useMemo(() => [], [t]);

  const faceIdMenu: MenuItemDef[] = useMemo(
    () => [
      {
        key: "faceid",
        icon: "face-recognition",
        label: t("faceid"),
        toggle: true,
        toggleValue: faceIDEnabled,
        onToggle: setFaceIDEnabled,
      },
    ],
    [t, faceIDEnabled]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("account.title")}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userCol}>
              <Text style={styles.name}>{displayName}</Text>
              {/* <Text style={styles.meta}>{displayPhone}</Text> */}
              <Text style={styles.metaSmall}>{displayEmail}</Text>
              {vehicle && (
                <View style={styles.vehicleBadge}>
                  <MaterialCommunityIcons
                    name="car-electric"
                    size={14}
                    color="#10b981"
                  />
                  <Text style={styles.vehicleText}>
                    {vehicle.name || vehicle.model || "Xe điện"}
                  </Text>
                </View>
              )}
              {activeSubscription && (
                <View style={styles.subscriptionBadge}>
                  <MaterialCommunityIcons
                    name="infinity"
                    size={14}
                    color="#ffffff"
                  />
                  <Text style={styles.subscriptionText}>
                    {activeSubscription.package?.name || "Premium"}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.quickStatsRow}>
            <View style={styles.statBox}>
              {loadingSubscriptions ? (
                <ActivityIndicator
                  size="small"
                  color={styleTokens.colors.primary}
                />
              ) : (
                <>
                  <Text style={styles.statValue}>{subscriptions.length}</Text>
                  <Text style={styles.statLabel}>{t("subscriptions")}</Text>
                </>
              )}
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              {loadingCredits ? (
                <ActivityIndicator
                  size="small"
                  color={styleTokens.colors.primary}
                />
              ) : (
                <>
                  <Text style={styles.statValue}>{totalSwaps}</Text>
                  <Text style={styles.statLabel}>{t("swapsRemaining")}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Face ID */}
        <View style={styles.sectionCard}>
          {faceIdMenu.map((m) => (
            <MenuItem key={m.key} item={m} />
          ))}
        </View>

        {/* Account */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("account.title")}</Text>
          </View>
          {accountMenu.map((m) => (
            <MenuItem key={m.key} item={m} />
          ))}
        </View>

        {/* Support */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("support.title", { defaultValue: "Hỗ trợ" })}
            </Text>
          </View>
          {supportMenu.map((m) => (
            <MenuItem key={m.key} item={m} />
          ))}
        </View>

        {/* Legal */}
        {legalMenu.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t("legal.title", { defaultValue: "Pháp lý" })}
              </Text>
            </View>
            {legalMenu.map((m) => (
              <MenuItem key={m.key} item={m} />
            ))}
          </View>
        )}

        {/* Language Switch */}
        <View style={styles.sectionCard}>
          <View style={styles.languageRow}>
            <View style={styles.languageLeft}>
              <MaterialCommunityIcons
                name="earth"
                size={20}
                color="#334155"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.menuLabel}>{t("language.label")}</Text>
            </View>
            <View style={styles.languageSwitch}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setLanguage("vi");
                  i18n.changeLanguage("vi");
                }}
                style={[
                  styles.languageOption,
                  language === "vi" && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === "vi" && styles.languageOptionTextActive,
                  ]}
                >
                  {t("lang.vi")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setLanguage("en");
                  i18n.changeLanguage("en");
                }}
                style={[
                  styles.languageOption,
                  language === "en" && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === "en" && styles.languageOptionTextActive,
                  ]}
                >
                  {t("lang.en")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="#dc2626"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>

        <View style={styles.versionBox}>
          <Text style={styles.versionText}>
            {t("profile.version")} 1.xx.x (2025.0818.0510)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: "center", paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  profileCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  profileRow: { flexDirection: "row", marginBottom: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5D7B6F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#ffffff" },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  userCol: { flex: 1 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 4 },
  meta: { fontSize: 14, color: "#475569", marginBottom: 2 },
  metaSmall: { fontSize: 12, color: "#64748b", marginBottom: 6 },
  vehicleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 4,
    marginBottom: 4,
  },
  vehicleText: { fontSize: 12, fontWeight: "600", color: "#10b981" },
  subscriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 4,
  },
  subscriptionText: { fontSize: 12, fontWeight: "600", color: "#ffffff" },
  quickStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: { fontSize: 11, color: "#64748b" },
  statDivider: { width: 1, backgroundColor: "#e2e8f0", marginVertical: 4 },
  vehicleInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  vehicleInfoLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  vehicleInfoValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  menuLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  menuIcon: { marginRight: 14 },
  menuLabel: { fontSize: 15, color: "#0f172a", flexShrink: 1 },
  dangerText: { color: "#dc2626" },
  badge: {
    marginLeft: 8,
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageLeft: { flexDirection: "row", alignItems: "center" },
  languageChoices: { flexDirection: "row", gap: 8 },
  languageSwitch: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "transparent",
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  languageOptionActive: {
    backgroundColor: "#5D7B6F",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  languageOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: 0.5,
  },
  languageOptionTextActive: {
    color: "#ffffff",
  },
  langPill: {
    backgroundColor: "#5D7B6F",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  langPillInactive: { backgroundColor: "#e2e8f0" },
  langTextInactive: { color: "#64748b" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginTop: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#dc2626" },
  versionBox: { alignItems: "center", marginTop: 24, marginBottom: 32 },
  versionText: { fontSize: 12, color: "#94a3b8" },
});
