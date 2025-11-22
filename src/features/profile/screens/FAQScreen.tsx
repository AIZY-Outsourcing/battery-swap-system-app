import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "FAQ">;

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen({}: Props) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const faqItems: FAQItem[] = [
    {
      question: t("faq.howToSwap.question"),
      answer: t("faq.howToSwap.answer"),
    },
    {
      question: t("faq.swapTypes.question"),
      answer: t("faq.swapTypes.answer"),
    },
    {
      question: t("faq.reservationExpiry.question"),
      answer: t("faq.reservationExpiry.answer"),
    },
    {
      question: t("faq.cancelReservation.question"),
      answer: t("faq.cancelReservation.answer"),
    },
    {
      question: t("faq.batteryIssue.question"),
      answer: t("faq.batteryIssue.answer"),
    },
    {
      question: t("faq.paymentMethods.question"),
      answer: t("faq.paymentMethods.answer"),
    },
    {
      question: t("faq.swapExpiry.question"),
      answer: t("faq.swapExpiry.answer"),
    },
    {
      question: t("faq.viewHistory.question"),
      answer: t("faq.viewHistory.answer"),
    },
    {
      question: t("faq.language.question"),
      answer: t("faq.language.answer"),
    },
    {
      question: t("faq.contact.question"),
      answer: t("faq.contact.answer"),
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
            name="help-circle-outline"
            size={48}
            color="#5D7B6F"
          />
          <Text style={styles.headerTitle}>
            {t("profile.faq", { defaultValue: "Câu hỏi thường gặp" })}
          </Text>
          <Text style={styles.headerSubtitle}>{t("faq.description")}</Text>
        </View>

        {faqItems.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          return (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <MaterialCommunityIcons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#64748b"
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Không tìm thấy câu trả lời?{" "}
            <Text style={styles.footerLink}>Liên hệ hỗ trợ</Text>
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
  faqItem: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    lineHeight: 22,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginTop: 8,
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
  footerLink: {
    color: "#5D7B6F",
    fontWeight: "600",
  },
});
