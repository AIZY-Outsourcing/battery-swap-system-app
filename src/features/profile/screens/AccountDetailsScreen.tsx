import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<AppStackParamList, "AccountDetails">;

export default function AccountDetailsScreen({ navigation }: Props) {
  // Mock data for demo
  const accountData = {
    singleSwaps: {
      count: 5,
      history: [
        {
          id: 1,
          stationName: "Trạm Cầu Giấy",
          date: "2024-09-28 14:30",
          batteryFrom: "45%",
          batteryTo: "98%",
          cost: "25,000đ",
        },
        {
          id: 2,
          stationName: "Trạm Đống Đa",
          date: "2024-09-27 09:15",
          batteryFrom: "23%",
          batteryTo: "95%",
          cost: "25,000đ",
        },
      ],
    },
    packageSwaps: {
      reserved: "20Tr",
      history: [
        {
          id: 1,
          packageName: "Gói Premium",
          purchaseDate: "2024-09-20",
          validUntil: "2024-10-20",
          swapsLeft: 20,
          totalSwaps: 30,
        },
      ],
    },
    wallet: {
      balance: "339đ",
      recentTransactions: [
        {
          id: 1,
          type: "Nạp tiền",
          amount: "+500,000đ",
          date: "2024-09-25",
          method: "MoMo",
        },
        {
          id: 2,
          type: "Đổi pin",
          amount: "-25,000đ",
          date: "2024-09-24",
          station: "Trạm Cầu Giấy",
        },
      ],
    },
  };

  const renderSectionHeader = (title: string, count?: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {count && <Text style={styles.sectionCount}>{count}</Text>}
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
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lượt đổi lẻ */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Lượt đổi lẻ",
            `${accountData.singleSwaps.count} lượt`
          )}
          {accountData.singleSwaps.history.map((swap) => (
            <View key={swap.id} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>{swap.stationName}</Text>
                <Text style={styles.transactionAmount}>{swap.cost}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDate}>{swap.date}</Text>
                <Text style={styles.batteryInfo}>
                  {swap.batteryFrom} → {swap.batteryTo}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Lượt đổi gói */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Lượt đổi gói",
            accountData.packageSwaps.reserved
          )}
          {accountData.packageSwaps.history.map((package_) => (
            <View key={package_.id} style={styles.packageItem}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{package_.packageName}</Text>
                <Text style={styles.packageStatus}>Đang hoạt động</Text>
              </View>
              <View style={styles.packageDetails}>
                <Text style={styles.packageInfo}>
                  Còn lại: {package_.swapsLeft}/{package_.totalSwaps} lượt
                </Text>
                <Text style={styles.packageExpiry}>
                  Hết hạn: {package_.validUntil}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Túi thần tài */}
        <View style={styles.section}>
          {renderSectionHeader("Túi thần tài", accountData.wallet.balance)}
          {accountData.wallet.recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>{transaction.type}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.amount.startsWith("+")
                      ? styles.positiveAmount
                      : styles.negativeAmount,
                  ]}
                >
                  {transaction.amount}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                {transaction.method && (
                  <Text style={styles.transactionMethod}>
                    {transaction.method}
                  </Text>
                )}
                {transaction.station && (
                  <Text style={styles.transactionMethod}>
                    {transaction.station}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b0d4b8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  backButtonText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#5D7B6F",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D7B6F",
  },
  transactionItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  positiveAmount: {
    color: "#4CAF50",
  },
  negativeAmount: {
    color: "#F44336",
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 14,
    color: "#888888",
  },
  batteryInfo: {
    fontSize: 14,
    color: "#5D7B6F",
    fontWeight: "500",
  },
  transactionMethod: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
  packageItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#5D7B6F",
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  packageStatus: {
    fontSize: 12,
    color: "#4CAF50",
    backgroundColor: "#4CAF5020",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  packageDetails: {
    gap: 4,
  },
  packageInfo: {
    fontSize: 14,
    color: "#5D7B6F",
    fontWeight: "500",
  },
  packageExpiry: {
    fontSize: 14,
    color: "#888888",
  },
  bottomSpacing: {
    height: 20,
  },
});
