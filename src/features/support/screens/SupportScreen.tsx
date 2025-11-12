import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import SupportService, {
  SupportTicket,
} from "../../../services/api/SupportService";
// import { launchImageLibrary } from 'react-native-image-picker';

const SupportScreen = () => {
  const [activeTab, setActiveTab] = useState<"create" | "tickets">("create");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === "tickets") {
      loadTickets();
    }
  }, [activeTab]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await SupportService.getMyTickets();
      setTickets(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách yêu cầu hỗ trợ");
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: "battery_error", label: "Pin lỗi" },
    { value: "kiosk_broken", label: "Kiosk hỏng" },
    { value: "payment_issue", label: "Sự cố thanh toán" },
    { value: "app_bug", label: "Lỗi ứng dụng" },
    { value: "reservation_issue", label: "Vấn đề đặt chỗ" },
    { value: "other", label: "Khác" },
  ];

  const handleImagePick = () => {
    // Placeholder for image picker - would need react-native-image-picker
    Alert.alert("Chức năng", "Tính năng chọn ảnh sẽ được thêm sau");
  };

  const handleSubmitTicket = async () => {
    if (!issueType || !description.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn loại sự cố và nhập mô tả");
      return;
    }

    try {
      setSubmitting(true);

      // Generate title from issue type
      const issueTypeLabel =
        issueTypes.find((t) => t.value === issueType)?.label ||
        "Yêu cầu hỗ trợ";

      await SupportService.createTicket({
        title: issueTypeLabel,
        subject_id: issueType,
        station_id: "", // Empty for now, can be added later
        description: description,
      });

      Alert.alert(
        "Thành công",
        "Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ phản hồi trong vòng 24h.",
        [
          {
            text: "OK",
            onPress: () => {
              setIssueType("");
              setDescription("");
              setAttachedImages([]);
              setActiveTab("tickets");
              loadTickets();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || "Không thể gửi yêu cầu hỗ trợ"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "#FF6B35";
      case "in_progress":
        return "#007AFF";
      case "resolved":
        return "#34C759";
      case "closed":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  const getStatusLabel = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "Mở";
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hỗ trợ</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "create" && styles.activeTab]}
          onPress={() => setActiveTab("create")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "create" && styles.activeTabText,
            ]}
          >
            Gửi yêu cầu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tickets" && styles.activeTab]}
          onPress={() => setActiveTab("tickets")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tickets" && styles.activeTabText,
            ]}
          >
            Tickets của tôi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "create" ? (
          /* Create Ticket Form */
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại sự cố *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.issueTypeContainer}
              >
                {issueTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.issueTypeChip,
                      issueType === type.value && styles.selectedIssueType,
                    ]}
                    onPress={() => setIssueType(type.value)}
                  >
                    <Text
                      style={[
                        styles.issueTypeText,
                        issueType === type.value &&
                          styles.selectedIssueTypeText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả chi tiết *</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Vui lòng mô tả chi tiết sự cố bạn gặp phải..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ảnh đính kèm (tuỳ chọn)</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleImagePick}
              >
                <Text style={styles.imagePickerText}>+ Thêm ảnh</Text>
              </TouchableOpacity>
              {attachedImages.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                  {attachedImages.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.imagePreview}
                    />
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitTicket}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Gửi yêu cầu hỗ trợ</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Tickets List */
          <View style={styles.ticketsContainer}>
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : tickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Bạn chưa có yêu cầu hỗ trợ nào
                </Text>
              </View>
            ) : (
              tickets.map((ticket) => (
                <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
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
                  <Text style={styles.ticketType}>
                    {ticket.subject?.name || "Hỗ trợ"}
                  </Text>
                  <Text style={styles.ticketDate}>
                    Tạo: {formatDate(new Date(ticket.created_at))}
                  </Text>
                  <Text style={styles.ticketDate}>
                    Cập nhật: {formatDate(new Date(ticket.updated_at))}
                  </Text>
                  {ticket.station && (
                    <Text style={styles.ticketStation}>
                      📍 {ticket.station.name}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  issueTypeContainer: {
    flexDirection: "row",
  },
  issueTypeChip: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedIssueType: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  issueTypeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedIssueTypeText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 100,
  },
  imagePickerButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#007AFF",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  ticketsContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  ticketType: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  ticketStation: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

export default SupportScreen;
