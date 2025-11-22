import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "Terms">;

export default function TermsScreen({}: Props) {
  const { t } = useTranslation();

  const termsSections = [
    {
      title: t("terms.general.title"),
      content: t("terms.intro.content"),
    },
    {
      title: "2. Sử dụng dịch vụ",
      content: `Bạn cam kết sử dụng dịch vụ một cách hợp pháp và phù hợp với mục đích của dịch vụ. Bạn không được sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc trái phép nào.`,
    },
    {
      title: t("terms.account.title"),
      content: t("terms.account.content"),
    },
    {
      title: t("terms.payment.title"),
      content: t("terms.payment.content"),
    },
    {
      title: t("terms.swapCredits.title"),
      content: t("terms.swapCredits.content"),
    },
    {
      title: t("terms.liability.title"),
      content: t("terms.liability.content"),
    },
    {
      title: "7. Bảo mật thông tin",
      content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo quy định của pháp luật về bảo vệ dữ liệu cá nhân. Thông tin của bạn sẽ được sử dụng chỉ cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.`,
    },
    {
      title: t("terms.changes.title"),
      content: t("terms.changes.content"),
    },
    {
      title: t("terms.termination.title"),
      content: t("terms.termination.content"),
    },
    {
      title: t("terms.contact.title"),
      content: t("terms.contact.content"),
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
            name="file-document-outline"
            size={48}
            color="#5D7B6F"
          />
          <Text style={styles.headerTitle}>
            {t("profile.terms", { defaultValue: "Điều khoản sử dụng" })}
          </Text>
          <Text style={styles.headerSubtitle}>
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introText}>{t("terms.description")}</Text>
        </View>

        {termsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
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
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
  intro: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  introText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    textAlign: "justify",
  },
  section: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    textAlign: "justify",
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
