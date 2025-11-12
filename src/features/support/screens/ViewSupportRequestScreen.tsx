import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SupportService, {
  SupportTicket,
} from "../../../services/api/SupportService";
import type { RootStackParamList } from "../../../navigation/types";

type ViewSupportRequestRouteProp = RouteProp<
  RootStackParamList,
  "SupportRequestDetail"
>;

const ViewSupportRequestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ViewSupportRequestRouteProp>();
  const { ticketId } = route.params;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    loadTicketDetail();
  }, []);

  const loadTicketDetail = async () => {
    try {
      setLoading(true);
      const response = await SupportService.getTicketById(ticketId);
      setTicket(response.data);
    } catch (error) {
      console.error("Error loading ticket:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin yêu cầu", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#34C759";
      case "in_progress":
        return "#FF9500";
      case "resolved":
        return "#007AFF";
      case "closed":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Mới";
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return adjustedDate.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Không tìm thấy yêu cầu</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(ticket.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(ticket.status)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Tiêu đề</Text>
          <Text style={styles.value}>{ticket.title}</Text>
        </View>

        {/* Subject */}
        {ticket.subject && (
          <View style={styles.section}>
            <Text style={styles.label}>Chủ đề</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{ticket.subject.name}</Text>
            </View>
          </View>
        )}

        {/* Station */}
        {ticket.station && (
          <View style={styles.section}>
            <Text style={styles.label}>Trạm</Text>
            <View style={styles.stationCard}>
              <Ionicons name="location" size={20} color="#34C759" />
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{ticket.station.name}</Text>
                <Text style={styles.stationAddress}>
                  {ticket.station.address}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Mô tả chi tiết</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{ticket.description}</Text>
          </View>
        </View>

        {/* Images */}
        {ticket.support_images && ticket.support_images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Hình ảnh đính kèm</Text>
            <View style={styles.imagesContainer}>
              {ticket.support_images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.image_url }}
                  style={styles.attachedImage}
                />
              ))}
            </View>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.label}>Thông tin thời gian</Text>
          <View style={styles.timestampContainer}>
            <View style={styles.timestampRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timestampLabel}>Tạo lúc:</Text>
              <Text style={styles.timestampValue}>
                {formatDate(ticket.created_at)}
              </Text>
            </View>
            <View style={styles.timestampRow}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.timestampLabel}>Cập nhật:</Text>
              <Text style={styles.timestampValue}>
                {formatDate(ticket.updated_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* ID for reference */}
        <View style={styles.section}>
          <Text style={styles.label}>Mã yêu cầu</Text>
          <Text style={styles.idText}>{ticket.id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#34C759",
  },
  chipText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  stationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  stationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: "#666",
  },
  descriptionBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  descriptionText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attachedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  timestampContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  timestampLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    width: 90,
  },
  timestampValue: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  idText: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
});

export default ViewSupportRequestScreen;
