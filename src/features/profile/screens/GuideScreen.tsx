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

type Props = NativeStackScreenProps<RootStackParamList, "Guide">;

export default function GuideScreen({}: Props) {
  const { t } = useTranslation();

  const guideSections = [
    {
      title: "Cách sử dụng ứng dụng",
      icon: "book-open-page-variant",
      content: [
        "1. Tìm trạm đổi pin gần bạn trên bản đồ hoặc danh sách",
        "2. Chọn trạm và xem thông tin chi tiết về pin có sẵn",
        "3. Đặt trước pin nếu cần để đảm bảo có pin khi đến",
        "4. Quét mã QR tại trạm để bắt đầu quá trình đổi pin",
        "5. Làm theo hướng dẫn trên màn hình để hoàn tất đổi pin",
      ],
    },
    {
      title: "Đặt trước pin",
      icon: "calendar-clock",
      content: [
        "Đặt trước pin giúp bạn đảm bảo có pin sẵn sàng khi đến trạm",
        "Bạn có thể đặt trước tối đa 30 phút trước khi đến",
        "Pin được giữ trong 15 phút sau thời gian dự kiến đến",
        "Hủy đặt trước nếu không thể đến đúng giờ để tránh mất lượt",
      ],
    },
    {
      title: "Quy trình đổi pin",
      icon: "swap-horizontal",
      content: [
        "Bước 1: Quét mã QR tại kiosk đổi pin",
        "Bước 2: Xác thực bằng mã PIN của bạn",
        "Bước 3: Mở cửa kiosk và đặt pin cũ vào",
        "Bước 4: Đợi hệ thống kiểm tra và sạc pin cũ",
        "Bước 5: Lấy pin mới từ kiosk",
        "Bước 6: Đóng cửa kiosk và hoàn tất",
      ],
    },
    {
      title: "Quản lý lượt đổi",
      icon: "battery",
      content: [
        "Bạn có thể mua lượt đổi lẻ hoặc đăng ký gói đổi pin",
        "Lượt đổi lẻ không có thời hạn, sử dụng bất cứ lúc nào",
        "Gói đổi pin có thời hạn và số lượt giới hạn",
        "Kiểm tra số lượt còn lại trong phần Quản lý lượt đổi",
      ],
    },
    {
      title: "Thanh toán",
      icon: "credit-card",
      content: [
        "Hỗ trợ nhiều phương thức thanh toán: Ví điện tử, Thẻ ngân hàng",
        "Thanh toán nhanh chóng và an toàn",
        "Xem lịch sử thanh toán trong phần Lịch sử",
        "Hóa đơn điện tử sẽ được gửi qua email",
      ],
    },
    {
      title: "Lưu ý quan trọng",
      icon: "alert-circle",
      content: [
        "Luôn kiểm tra pin trước khi rời khỏi trạm",
        "Báo cáo sự cố ngay nếu phát hiện pin có vấn đề",
        "Tuân thủ hướng dẫn an toàn tại trạm",
        "Liên hệ hỗ trợ nếu cần trợ giúp",
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
          <Text style={styles.headerSubtitle}>
            Hướng dẫn chi tiết về cách sử dụng ứng dụng đổi pin
          </Text>
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
          <Text style={styles.footerText}>
            Cần hỗ trợ thêm? Liên hệ với chúng tôi qua phần Yêu cầu hỗ trợ
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

