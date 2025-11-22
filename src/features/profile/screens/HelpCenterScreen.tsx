import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "HelpCenter">;

export default function HelpCenterScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const contactMethods = [
    {
      title: t("helpCenter.inAppSupport"),
      icon: "message-question-outline",
      description: t("helpCenter.inAppSupportDesc"),
      action: () => navigation.navigate("SupportRequest"),
      actionText: t("helpCenter.sendRequest"),
    },
    {
      title: t("helpCenter.hotline"),
      icon: "phone",
      description: t("helpCenter.hotlineDesc"),
      phone: "1900 1234",
      action: () => Linking.openURL("tel:19001234"),
      actionText: t("helpCenter.callNow"),
    },
    {
      title: t("helpCenter.email"),
      icon: "email-outline",
      description: t("helpCenter.emailDesc"),
      email: "support@batterystation.vn",
      action: () => Linking.openURL("mailto:support@batterystation.vn"),
      actionText: t("helpCenter.sendEmail"),
    },
    {
      title: t("helpCenter.website"),
      icon: "web",
      description: t("helpCenter.websiteDesc"),
      url: "https://batterystation.vn",
      action: () => Linking.openURL("https://batterystation.vn"),
      actionText: t("helpCenter.visit"),
    },
  ];

  const quickLinks = [
    {
      title: t("profile.guide"),
      icon: "book-open-page-variant",
      onPress: () => navigation.navigate("Guide"),
    },
    {
      title: t("profile.faq"),
      icon: "help-circle-outline",
      onPress: () => navigation.navigate("FAQ"),
    },
    {
      title: t("profile.terms"),
      icon: "file-document-outline",
      onPress: () => navigation.navigate("Terms"),
    },
  ];

  const workingHours = {
    weekdays: t("helpCenter.weekdays"),
    weekend: t("helpCenter.weekend"),
    note: t("helpCenter.support247"),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="headset" size={48} color="#5D7B6F" />
          <Text style={styles.headerTitle}>
            {t("profile.helpCenter", { defaultValue: "Trung tâm trợ giúp" })}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("helpCenter.noAnswer", {
              defaultValue: "Chúng tôi luôn sẵn sàng hỗ trợ bạn",
            })}
          </Text>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("helpCenter.quickLinks")}</Text>
          <View style={styles.quickLinksContainer}>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickLinkItem}
                onPress={link.onPress}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={link.icon as any}
                  size={24}
                  color="#5D7B6F"
                />
                <Text style={styles.quickLinkText}>{link.title}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("helpCenter.contact", { defaultValue: "Cách liên hệ" })}
          </Text>
          {contactMethods.map((method, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={24}
                  color="#5D7B6F"
                />
                <Text style={styles.contactTitle}>{method.title}</Text>
              </View>
              <Text style={styles.contactDescription}>
                {method.description}
              </Text>
              {method.phone && (
                <Text style={styles.contactInfo}>{method.phone}</Text>
              )}
              {method.email && (
                <Text style={styles.contactInfo}>{method.email}</Text>
              )}
              {method.url && (
                <Text style={styles.contactInfo}>{method.url}</Text>
              )}
              <TouchableOpacity
                style={styles.contactButton}
                onPress={method.action}
                activeOpacity={0.7}
              >
                <Text style={styles.contactButtonText}>
                  {method.actionText}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={18}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Working Hours */}
        <View style={styles.section}>
          <View style={styles.workingHoursCard}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={32}
              color="#5D7B6F"
            />
            <Text style={styles.workingHoursTitle}>
              {t("helpCenter.workingHours")}
            </Text>
            <Text style={styles.workingHoursText}>{workingHours.weekdays}</Text>
            <Text style={styles.workingHoursText}>{workingHours.weekend}</Text>
            <View style={styles.workingHoursNote}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#64748b"
              />
              <Text style={styles.workingHoursNoteText}>
                {workingHours.note}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Không tìm thấy câu trả lời? Hãy liên hệ với chúng tôi, chúng tôi sẽ
            hỗ trợ bạn trong thời gian sớm nhất.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  quickLinksContainer: {
    gap: 8,
  },
  quickLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  quickLinkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  contactCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  contactDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#5D7B6F",
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7B6F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  workingHoursCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  workingHoursTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    marginBottom: 16,
  },
  workingHoursText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
    textAlign: "center",
  },
  workingHoursNote: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 8,
  },
  workingHoursNoteText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
