import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "subscription";
  title: string;
  subtitle: string;
  isDefault: boolean;
}

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      title: "Visa ending in 1234",
      subtitle: "Expires 12/26",
      isDefault: true,
    },
    {
      id: "2",
      type: "subscription",
      title: "Gold Subscription",
      subtitle: "15 swaps remaining this month",
      isDefault: false,
    },
    {
      id: "3",
      type: "wallet",
      title: "BSS Wallet",
      subtitle: "Balance: $25.50",
      isDefault: false,
    },
  ]);

  const swapCost = 12.5;
  const tax = 1.25;
  const total = swapCost + tax;

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    Alert.alert("Confirm Payment", `Process payment of $${total.toFixed(2)}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Pay Now",
        onPress: () =>
          Alert.alert("Success", "Payment processed successfully!"),
      },
    ]);
  };

  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return "💳";
      case "subscription":
        return "⭐";
      case "wallet":
        return "👛";
      default:
        return "💳";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Complete your battery swap</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Battery Swap</Text>
          <Text style={styles.summaryValue}>${swapCost.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax & Fees</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedMethod === method.id && styles.selectedMethod,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodIcon}>
              <Text style={styles.iconText}>{getMethodIcon(method.type)}</Text>
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>{method.title}</Text>
              <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
            </View>

            <View style={styles.radioButton}>
              {selectedMethod === method.id && (
                <View style={styles.radioSelected} />
              )}
            </View>

            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addMethodButton}>
          <Text style={styles.addMethodText}>+ Add Payment Method</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Station:</Text>
          <Text style={styles.detailValue}>Downtown Station</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>Today, 2:30 PM</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>~15 minutes</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!selectedMethod}
      >
        <Text style={styles.payButtonText}>Pay ${total.toFixed(2)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectedMethod: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  defaultBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  addMethodButton: {
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderStyle: "dashed",
  },
  addMethodText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  payButton: {
    backgroundColor: "#007AFF",
    margin: 16,
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#ccc",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
