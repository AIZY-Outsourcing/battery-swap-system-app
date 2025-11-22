import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme";

interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "bank";
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
}

interface PaymentMethodsScreenProps {
  navigation: any;
}

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "wallet",
      name: "Ví BSS",
      details: "Số dư: 150.000 VND",
      icon: "💳",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "Thẻ Visa",
      details: "**** **** **** 1234",
      icon: "💳",
      isDefault: false,
    },
    {
      id: "3",
      type: "wallet",
      name: "MoMo",
      details: "0987654321",
      icon: "📱",
      isDefault: false,
    },
    {
      id: "4",
      type: "bank",
      name: "Vietcombank",
      details: "**** **** **** 5678",
      icon: "🏦",
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<
    "card" | "wallet" | "bank"
  >("card");

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleDeleteMethod = (methodId: string) => {
    Alert.alert(
      t("payment.methods.delete.title"),
      t("payment.methods.delete.message"),
      [
        { text: t("reservation.cancelNo"), style: "cancel" },
        {
          text: t("settings.deleteAccount.confirm"),
          style: "destructive",
          onPress: () => {
            setPaymentMethods((methods) =>
              methods.filter((method) => method.id !== methodId)
            );
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    setShowAddModal(true);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.paymentMethodItem}>
      <View style={styles.methodInfo}>
        <Text style={styles.methodIcon}>{item.icon}</Text>
        <View style={styles.methodDetails}>
          <Text style={styles.methodName}>{item.name}</Text>
          <Text style={styles.methodSubtext}>{item.details}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Mặc định</Text>
          </View>
        )}
      </View>

      <View style={styles.methodActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.setDefaultButtonText}>Đặt mặc định</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMethod(item.id)}
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Ví BSS</Text>
        <Text style={styles.balanceAmount}>150.000 VND</Text>
        <TouchableOpacity
          style={styles.topUpButton}
          onPress={() => navigation.navigate("TopUp")}
        >
          <Text style={styles.topUpButtonText}>Nạp tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods List */}
      <View style={styles.methodsSection}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán khác</Text>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Payment Method Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm phương thức thanh toán</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.typeLabel}>Loại thanh toán</Text>
              <View style={styles.typeOptions}>
                {[
                  { id: "card", label: "Thẻ tín dụng/ghi nợ", icon: "💳" },
                  { id: "wallet", label: "Ví điện tử", icon: "📱" },
                  { id: "bank", label: "Tài khoản ngân hàng", icon: "🏦" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.typeOption,
                      newPaymentType === option.id && styles.typeOptionSelected,
                    ]}
                    onPress={() => setNewPaymentType(option.id as any)}
                  >
                    <Text style={styles.typeOptionIcon}>{option.icon}</Text>
                    <Text style={styles.typeOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    setShowAddModal(false);
                    // Navigate to add payment method screen
                    navigation.navigate("AddPaymentMethod", {
                      type: newPaymentType,
                    });
                  }}
                >
                  <Text style={styles.confirmButtonText}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  addButton: {
    padding: 8,
  },
  addIcon: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  topUpButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  topUpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  methodsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  paymentMethodItem: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  methodActions: {
    flexDirection: "row",
    gap: 8,
  },
  setDefaultButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  setDefaultButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.error,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: theme.colors.surface.default,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  modalContent: {
    padding: 20,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  typeOptions: {
    gap: 8,
    marginBottom: 20,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: "transparent",
  },
  typeOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface.pressed,
  },
  typeOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  typeOptionText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
