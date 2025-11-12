import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SupportService, {
  CreateSupportTicketDto,
} from "../../../services/api/SupportService";
import SupportSubjectService, {
  SupportSubject,
} from "../../../services/api/SupportSubjectService";
import { listStations } from "../../../services/api/StationService";
import type { Station } from "../../../types/station";

const CreateSupportRequestScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SupportSubject[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [subjectsRes, stationsData] = await Promise.all([
        SupportSubjectService.getActiveSubjects(),
        listStations(), // Get all stations without location filter
      ]);
      console.log("Subjects response:", subjectsRes);
      console.log("Stations data:", stationsData);
      console.log("Stations data length:", stationsData?.length);

      // Convert object with numeric keys to array
      let subjectsArray: SupportSubject[] = [];
      if (subjectsRes.data) {
        if (Array.isArray(subjectsRes.data)) {
          subjectsArray = subjectsRes.data;
        } else if (typeof subjectsRes.data === "object") {
          // Convert {"0": {...}, "1": {...}} to array
          subjectsArray = Object.values(subjectsRes.data);
        }
      }

      setSubjects(subjectsArray);
      // Use stations data (which includes mock data fallback in StationService)
      setStations(Array.isArray(stationsData) ? stationsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setSubjects([]);
      setStations([]);
      Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn chủ đề hỗ trợ");
      return;
    }
    if (!selectedStation) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn trạm");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập mô tả chi tiết");
      return;
    }

    try {
      setLoading(true);
      const data: CreateSupportTicketDto = {
        title: title.trim(),
        description: description.trim(),
        subject_id: selectedSubject,
        station_id: selectedStation,
        support_images: attachedImages.map((url) => ({ image_url: url })),
      };

      await SupportService.createTicket(data);
      Alert.alert("Thành công", "Yêu cầu hỗ trợ đã được gửi", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || "Không thể tạo yêu cầu hỗ trợ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Cần quyền truy cập",
          "Vui lòng cấp quyền truy cập thư viện ảnh để tiếp tục"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset.uri);
        setAttachedImages([...attachedImages, ...newImages]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
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
        <Text style={styles.headerTitle}>Tạo yêu cầu hỗ trợ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Chủ đề hỗ trợ <Text style={styles.required}>*</Text>
          </Text>
          {!Array.isArray(subjects) || subjects.length === 0 ? (
            <Text style={styles.emptyText}>Không có chủ đề nào</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsContainer}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.chip,
                    selectedSubject === subject.id && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedSubject(subject.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSubject === subject.id && styles.chipTextSelected,
                    ]}
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Station Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Chọn trạm <Text style={styles.required}>*</Text>
          </Text>
          {!Array.isArray(stations) || stations.length === 0 ? (
            <Text style={styles.emptyText}>Không có trạm nào</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsContainer}
            >
              {stations.slice(0, 10).map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={[
                    styles.chip,
                    selectedStation === String(station.id) &&
                      styles.chipSelected,
                  ]}
                  onPress={() => setSelectedStation(String(station.id))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedStation === String(station.id) &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {station.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Tiêu đề <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tiêu đề ngắn gọn"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Mô tả chi tiết <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Image Attachment */}
        <View style={styles.section}>
          <Text style={styles.label}>Đính kèm hình ảnh (Tùy chọn)</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handlePickImage}
          >
            <Ionicons name="camera-outline" size={24} color="#007AFF" />
            <Text style={styles.imagePickerText}>Thêm hình ảnh</Text>
          </TouchableOpacity>

          {attachedImages.length > 0 && (
            <View style={styles.imagesPreview}>
              {attachedImages.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() =>
                      setAttachedImages(
                        attachedImages.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
          )}
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  chipsContainer: {
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#34C759",
    borderStyle: "dashed",
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#34C759",
    fontWeight: "500",
  },
  imagesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#34C759",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default CreateSupportRequestScreen;
