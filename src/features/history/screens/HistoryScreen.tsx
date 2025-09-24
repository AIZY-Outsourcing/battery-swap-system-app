import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"swap" | "payment">("swap");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "swap" && styles.activeTab]}
          onPress={() => setActiveTab("swap")}
        >
          <Text style={styles.tabText}>Đổi pin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "payment" && styles.activeTab]}
          onPress={() => setActiveTab("payment")}
        >
          <Text style={styles.tabText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text>Tab hiện tại: {activeTab}</Text>
      </View>
    </View>
  );
}

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
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  tabText: {
    color: "#666",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
