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
      question: "Làm thế nào để đổi pin?",
      answer:
        "Bạn có thể tìm trạm đổi pin gần nhất trên ứng dụng, quét mã QR tại kiosk, và làm theo hướng dẫn trên màn hình. Hệ thống sẽ tự động xử lý quá trình đổi pin cho bạn.",
    },
    {
      question: "Tôi cần bao nhiêu lượt đổi để sử dụng dịch vụ?",
      answer:
        "Bạn có thể mua lượt đổi lẻ hoặc đăng ký gói đổi pin. Lượt đổi lẻ không có thời hạn, còn gói đổi pin có thời hạn và số lượt giới hạn tùy theo gói bạn chọn.",
    },
    {
      question: "Pin được giữ trong bao lâu sau khi đặt trước?",
      answer:
        "Pin được giữ trong 15 phút sau thời gian dự kiến đến của bạn. Nếu bạn không đến trong thời gian này, đặt trước sẽ tự động bị hủy.",
    },
    {
      question: "Tôi có thể hủy đặt trước không?",
      answer:
        "Có, bạn có thể hủy đặt trước bất cứ lúc nào từ phần Đặt trước của tôi. Hủy đặt trước sẽ không làm mất lượt đổi của bạn.",
    },
    {
      question: "Làm gì nếu pin có vấn đề?",
      answer:
        "Nếu phát hiện pin có vấn đề, vui lòng báo cáo ngay qua phần Yêu cầu hỗ trợ trong ứng dụng. Chúng tôi sẽ xử lý và hỗ trợ bạn trong thời gian sớm nhất.",
    },
    {
      question: "Tôi có thể thanh toán bằng cách nào?",
      answer:
        "Ứng dụng hỗ trợ nhiều phương thức thanh toán như ví điện tử (MoMo, ZaloPay) và thẻ ngân hàng. Tất cả giao dịch đều được bảo mật và mã hóa.",
    },
    {
      question: "Lượt đổi có thời hạn không?",
      answer:
        "Lượt đổi lẻ không có thời hạn, bạn có thể sử dụng bất cứ lúc nào. Gói đổi pin có thời hạn cụ thể tùy theo gói bạn đăng ký, thường là 30 ngày hoặc theo thời hạn của gói.",
    },
    {
      question: "Tôi có thể xem lịch sử đổi pin ở đâu?",
      answer:
        "Bạn có thể xem lịch sử đổi pin và thanh toán trong tab Lịch sử ở màn hình chính. Tại đây bạn có thể xem tất cả các giao dịch đã thực hiện.",
    },
    {
      question: "Ứng dụng có hỗ trợ đa ngôn ngữ không?",
      answer:
        "Có, ứng dụng hỗ trợ tiếng Việt và tiếng Anh. Bạn có thể thay đổi ngôn ngữ trong phần Cài đặt của màn hình Profile.",
    },
    {
      question: "Làm sao để liên hệ hỗ trợ?",
      answer:
        "Bạn có thể liên hệ hỗ trợ qua phần Yêu cầu hỗ trợ trong ứng dụng. Chúng tôi sẽ phản hồi trong thời gian sớm nhất có thể.",
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
          <Text style={styles.headerSubtitle}>
            Tìm câu trả lời cho các câu hỏi phổ biến
          </Text>
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

