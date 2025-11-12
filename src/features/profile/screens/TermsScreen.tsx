import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "Terms">;

export default function TermsScreen({}: Props) {
  const { t } = useTranslation();

  const termsSections = [
    {
      title: "1. Điều khoản chung",
      content: `Bằng việc sử dụng ứng dụng đổi pin này, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.`,
    },
    {
      title: "2. Sử dụng dịch vụ",
      content: `Bạn cam kết sử dụng dịch vụ một cách hợp pháp và phù hợp với mục đích của dịch vụ. Bạn không được sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc trái phép nào.`,
    },
    {
      title: "3. Tài khoản người dùng",
      content: `Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình, bao gồm mật khẩu và mã PIN. Bạn phải thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hoạt động đáng ngờ nào liên quan đến tài khoản của bạn.`,
    },
    {
      title: "4. Thanh toán",
      content: `Tất cả các giao dịch thanh toán đều được xử lý thông qua các cổng thanh toán an toàn. Bạn chịu trách nhiệm thanh toán đầy đủ cho các dịch vụ đã sử dụng. Chúng tôi có quyền từ chối hoặc hủy bỏ bất kỳ giao dịch nào nếu phát hiện gian lận.`,
    },
    {
      title: "5. Lượt đổi pin",
      content: `Lượt đổi pin có thể được mua dưới dạng lượt đổi lẻ hoặc gói đăng ký. Lượt đổi lẻ không có thời hạn sử dụng. Gói đăng ký có thời hạn và số lượt giới hạn theo quy định của từng gói. Lượt đổi không được hoàn tiền sau khi đã mua.`,
    },
    {
      title: "6. Trách nhiệm",
      content: `Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, bao gồm nhưng không giới hạn ở thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả.`,
    },
    {
      title: "7. Bảo mật thông tin",
      content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo quy định của pháp luật về bảo vệ dữ liệu cá nhân. Thông tin của bạn sẽ được sử dụng chỉ cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.`,
    },
    {
      title: "8. Thay đổi điều khoản",
      content: `Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay sau khi được công bố trên ứng dụng. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.`,
    },
    {
      title: "9. Chấm dứt dịch vụ",
      content: `Chúng tôi có quyền chấm dứt hoặc tạm ngưng tài khoản của bạn nếu bạn vi phạm các điều khoản này hoặc có hành vi không phù hợp. Trong trường hợp này, bạn sẽ không được hoàn tiền cho các lượt đổi chưa sử dụng.`,
    },
    {
      title: "10. Liên hệ",
      content: `Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua phần Yêu cầu hỗ trợ trong ứng dụng hoặc email hỗ trợ.`,
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
          <Text style={styles.introText}>
            Vui lòng đọc kỹ các điều khoản và điều kiện sử dụng dịch vụ dưới đây. Bằng việc sử dụng ứng dụng, bạn đồng ý với tất cả các điều khoản được nêu ra.
          </Text>
        </View>

        {termsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua phần Yêu cầu hỗ trợ.
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

