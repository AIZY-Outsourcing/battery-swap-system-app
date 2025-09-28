import React, { useState, useMemo } from "react";
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
import { mockUser, mockSubscriptions } from "../../../data/mockData";
import { styleTokens } from "../../../styles/tokens";

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
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);
  const activeSubscription = mockSubscriptions[0];
  const [language, setLanguage] = useState<"vi" | "en">(
    i18n.language as "vi" | "en"
  );

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
        key: "promo",
        icon: "gift-outline",
        label: t("profile.promo"),
        onPress: devAlert,
      },
      {
        key: "guide",
        icon: "book-open-page-variant",
        label: t("profile.guide"),
        onPress: devAlert,
      },
      {
        key: "faq",
        icon: "help-circle-outline",
        label: t("profile.faq"),
        onPress: devAlert,
      },
    ],
    [t]
  );
  const supportMenu: MenuItemDef[] = useMemo(
    () => [
      {
        key: "helpcenter",
        icon: "headset",
        label: t("profile.helpCenter"),
        onPress: devAlert,
      },
      {
        key: "support",
        icon: "message-question-outline",
        label: t("profile.supportRequest"),
        onPress: devAlert,
      },
    ],
    [t]
  );
  const legalMenu: MenuItemDef[] = useMemo(
    () => [
      {
        key: "terms",
        icon: "file-document-outline",
        label: t("profile.terms"),
        onPress: devAlert,
      },
    ],
    [t]
  );

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
              <Text style={styles.avatarText}>{mockUser.name.charAt(0)}</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userCol}>
              <Text style={styles.name}>{mockUser.name}</Text>
              <Text style={styles.meta}>{mockUser.phone}</Text>
              <Text style={styles.metaSmall}>
                {t("profile.batteryTypeLabel")}: {mockUser.batteryType}
              </Text>
              {activeSubscription && (
                <View style={styles.subscriptionBadge}>
                  <MaterialCommunityIcons
                    name="infinity"
                    size={14}
                    color="#ffffff"
                  />
                  <Text style={styles.subscriptionText}>
                    {activeSubscription.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.quickStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{mockSubscriptions.length}</Text>
              <Text style={styles.statLabel}>{t("subscriptions")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>{t("swapsPerMonth")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>{t("points")}</Text>
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
