import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "Guide">;

export default function GuideScreen({}: Props) {
  const { t } = useTranslation();

  const guideSections = [
    {
      title: t("guide.howToUse.title"),
      icon: "book-open-page-variant",
      content: [
        t("guide.step1"),
        t("guide.step2"),
        t("guide.step3"),
        t("guide.step4"),
        t("guide.step5"),
      ],
    },
    {
      title: t("guide.reservation.title"),
      icon: "calendar-clock",
      content: [
        t("guide.reservation.content1"),
        t("guide.reservation.content2"),
        t("guide.reservation.content3"),
        t("guide.reservation.content4"),
      ],
    },
    {
      title: t("guide.swapProcess.title"),
      icon: "swap-horizontal",
      content: [
        t("guide.swapProcess.step1"),
        t("guide.swapProcess.step2"),
        t("guide.swapProcess.step3"),
        t("guide.swapProcess.step4"),
        t("guide.swapProcess.step5"),
        t("guide.swapProcess.step6"),
      ],
    },
    {
      title: t("guide.swapManagement.title"),
      icon: "battery",
      content: [
        t("guide.payment.single"),
        t("guide.swapManagement.content1"),
        t("guide.payment.package"),
        t("guide.swapManagement.content2"),
      ],
    },
    {
      title: t("guide.payment.title"),
      icon: "credit-card",
      content: [
        t("guide.payment.methods"),
        t("guide.payment.secure"),
        t("guide.payment.history"),
        t("guide.payment.invoice"),
      ],
    },
    {
      title: t("guide.safety.title"),
      icon: "alert-circle",
      content: [
        t("guide.safety.content1"),
        t("guide.safety.content2"),
        t("guide.safety.content3"),
        t("guide.safety.content4"),
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={48}
            color="#5D7B6F"
          />
          <Text style={styles.headerTitle}>
            {t("profile.guide", { defaultValue: "Hướng dẫn sử dụng" })}
          </Text>
          <Text style={styles.headerSubtitle}>{t("guide.description")}</Text>
        </View>

        {guideSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name={section.icon as any}
                size={24}
                color="#5D7B6F"
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.content.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.contentItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.contentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("terms.footer")}</Text>
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
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  sectionContent: {
    gap: 12,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5D7B6F",
    marginTop: 6,
  },
  contentText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    flex: 1,
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
