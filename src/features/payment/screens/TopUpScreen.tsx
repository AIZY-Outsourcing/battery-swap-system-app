import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme";

interface TopUpScreenProps {
  navigation: any;
}

export const TopUpScreen: React.FC<TopUpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card1");

  const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const paymentMethods = [
    {
      id: "card1",
      name: "Thẻ Visa",
      details: "**** **** **** 1234",
      icon: "💳",
    },
    {
      id: "momo",
      name: "MoMo",
      details: "0987654321",
      icon: "📱",
    },
    {
      id: "bank1",
      name: "Vietcombank",
      details: "**** **** **** 5678",
      icon: "🏦",
    },
  ];

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    setCustomAmount(cleanText);
    setSelectedAmount(null);
  };

  const getFinalAmount = (): number => {
    if (customAmount) {
      return parseInt(customAmount) || 0;
    }
    return selectedAmount || 0;
  };

  const handleTopUp = () => {
    const amount = getFinalAmount();
    if (amount < 10000) {
      Alert.alert(
        t("support.error"),
        t("topUp.minAmount", {
          defaultValue: "Số tiền nạp tối thiểu là 10.000 VND",
        })
      );
      return;
    }

    Alert.alert(
      t("topUp.confirm", { defaultValue: "Xác nhận nạp tiền" }),
      t("topUp.confirmMessage", {
        defaultValue: `Bạn có chắc muốn nạp ${formatCurrency(
          amount
        )} vào ví BSS?`,
        amount: formatCurrency(amount),
      }),
      [
        { text: t("reservation.cancelNo"), style: "cancel" },
        {
          text: t("order.confirm"),
          onPress: () => {
            // Navigate to payment processing or success screen
            navigation.navigate("PaymentProcessing", {
              amount,
              paymentMethod: selectedPaymentMethod,
              type: "topup",
            });
          },
        },
      ]
    );
  };

  const renderAmountButton = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        styles.amountButton,
        selectedAmount === item && styles.amountButtonSelected,
      ]}
      onPress={() => handleAmountSelect(item)}
    >
      <Text
        style={[
          styles.amountButtonText,
          selectedAmount === item && styles.amountButtonTextSelected,
        ]}
      >
        {formatCurrency(item)}
      </Text>
    </TouchableOpacity>
  );

  const renderPaymentMethod = ({
    item,
  }: {
    item: (typeof paymentMethods)[0];
  }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodItem,
        selectedPaymentMethod === item.id && styles.paymentMethodSelected,
      ]}
      onPress={() => setSelectedPaymentMethod(item.id)}
    >
      <View style={styles.methodInfo}>
        <Text style={styles.methodIcon}>{item.icon}</Text>
        <View style={styles.methodDetails}>
          <Text style={styles.methodName}>{item.name}</Text>
          <Text style={styles.methodSubtext}>{item.details}</Text>
        </View>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedPaymentMethod === item.id && styles.radioButtonSelected,
        ]}
      >
        {selectedPaymentMethod === item.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Nạp tiền vào ví</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Current Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>150.000 VND</Text>
      </View>

      {/* Amount Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chọn số tiền nạp</Text>
        <FlatList
          data={presetAmounts}
          numColumns={2}
          keyExtractor={(item) => item.toString()}
          renderItem={renderAmountButton}
          columnWrapperStyle={styles.amountRow}
          scrollEnabled={false}
        />

        <View style={styles.customAmountContainer}>
          <Text style={styles.customAmountLabel}>Hoặc nhập số tiền khác</Text>
          <TextInput
            style={styles.customAmountInput}
            placeholder="Nhập số tiền (VND)"
            placeholderTextColor={theme.colors.text.secondary}
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            keyboardType="numeric"
          />
          <Text style={styles.minAmountNote}>
            Số tiền nạp tối thiểu: 10.000 VND
          </Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          scrollEnabled={false}
        />
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Số tiền nạp</Text>
          <Text style={styles.summaryValue}>
            {getFinalAmount() > 0 ? formatCurrency(getFinalAmount()) : "0 VND"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phí giao dịch</Text>
          <Text style={styles.summaryValue}>Miễn phí</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Tổng thanh toán</Text>
          <Text style={styles.summaryTotalValue}>
            {getFinalAmount() > 0 ? formatCurrency(getFinalAmount()) : "0 VND"}
          </Text>
        </View>
      </View>

      {/* Top Up Button */}
      <TouchableOpacity
        style={[
          styles.topUpButton,
          getFinalAmount() < 10000 && styles.topUpButtonDisabled,
        ]}
        onPress={handleTopUp}
        disabled={getFinalAmount() < 10000}
      >
        <Text style={styles.topUpButtonText}>
          Nạp tiền{" "}
          {getFinalAmount() > 0 ? formatCurrency(getFinalAmount()) : ""}
        </Text>
      </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  balanceContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: theme.colors.surface.elevated,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  amountRow: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountButton: {
    flex: 0.48,
    backgroundColor: theme.colors.surface.elevated,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  amountButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface.pressed,
  },
  amountButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text.primary,
  },
  amountButtonTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  customAmountContainer: {
    marginTop: 16,
  },
  customAmountLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  customAmountInput: {
    backgroundColor: theme.colors.surface.elevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  minAmountNote: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface.elevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  paymentMethodSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface.pressed,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  summaryContainer: {
    backgroundColor: theme.colors.surface.elevated,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginVertical: 8,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  topUpButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  topUpButtonDisabled: {
    backgroundColor: theme.colors.border.disabled,
  },
  topUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
