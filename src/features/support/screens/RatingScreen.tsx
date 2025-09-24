import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  stationName?: string;
  transactionId?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  stationName = "Trạm BSS",
  transactionId,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá");
      return;
    }

    // Here you would send the rating to your backend
    Alert.alert(
      "Cảm ơn!",
      "Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn đã sử dụng dịch vụ!",
      [
        {
          text: "OK",
          onPress: () => {
            setRating(0);
            setComment("");
            onClose();
          },
        },
      ]
    );
  };

  const handleSkip = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starButton}
          onPress={() => handleStarPress(i)}
        >
          <Text style={[styles.star, rating >= i && styles.starActive]}>
            ⭐
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Rất tệ";
      case 2:
        return "Tệ";
      case 3:
        return "Bình thường";
      case 4:
        return "Tốt";
      case 5:
        return "Xuất sắc";
      default:
        return "";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đánh giá dịch vụ</Text>
          <Text style={styles.modalSubtitle}>
            Bạn có hài lòng với dịch vụ đổi pin tại {stationName}?
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>{renderStars()}</View>

          {rating > 0 && (
            <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
          )}

          {/* Comment Input */}
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Chia sẻ thêm về trải nghiệm của bạn... (tuỳ chọn)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Bỏ qua</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                rating === 0 && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitRating}
              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Rating History Screen Component
const RatingHistoryScreen = () => {
  const [ratings] = useState([
    {
      id: "1",
      stationName: "Trạm BSS Cầu Giấy",
      rating: 5,
      comment: "Dịch vụ tuyệt vời, pin đầy nhanh!",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      transactionId: "TXN001",
    },
    {
      id: "2",
      stationName: "Trạm BSS Thanh Xuân",
      rating: 4,
      comment: "Tốt, nhưng kiosk hơi chậm",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      transactionId: "TXN002",
    },
    {
      id: "3",
      stationName: "Trạm BSS Hà Đông",
      rating: 3,
      comment: "",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      transactionId: "TXN003",
    },
  ]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={[styles.historyStar, rating >= i && styles.historyStarActive]}
        >
          ⭐
        </Text>
      );
    }
    return stars;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử đánh giá</Text>
      </View>

      <View style={styles.content}>
        {ratings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Bạn chưa có đánh giá nào</Text>
          </View>
        ) : (
          ratings.map((item) => (
            <View key={item.id} style={styles.ratingCard}>
              <View style={styles.ratingHeader}>
                <Text style={styles.stationName}>{item.stationName}</Text>
                <Text style={styles.ratingDate}>{formatDate(item.date)}</Text>
              </View>

              <View style={styles.ratingStarsContainer}>
                {renderStars(item.rating)}
              </View>

              {item.comment ? (
                <Text style={styles.ratingComment}>{item.comment}</Text>
              ) : (
                <Text style={styles.noComment}>Không có bình luận</Text>
              )}

              <Text style={styles.transactionId}>
                Mã giao dịch: {item.transactionId}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    color: "#ddd",
  },
  starActive: {
    color: "#FFD700",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 24,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  skipButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },

  // History screen styles
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
  content: {
    flex: 1,
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
  ratingCard: {
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
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  ratingDate: {
    fontSize: 14,
    color: "#888",
  },
  ratingStarsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  historyStar: {
    fontSize: 16,
    color: "#ddd",
    marginRight: 2,
  },
  historyStarActive: {
    color: "#FFD700",
  },
  ratingComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  noComment: {
    fontSize: 14,
    color: "#ccc",
    fontStyle: "italic",
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 12,
    color: "#888",
  },
});

export { RatingModal, RatingHistoryScreen };
export default RatingHistoryScreen;
