import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SupportService, {
  SupportTicket,
} from "../../../services/api/SupportService";

type StatusFilter = "all" | "open" | "in_progress" | "resolved" | "closed";

const SupportRequestScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await SupportService.getMyTickets();
      console.log("Tickets response:", response);

      // Handle both array and object responses
      let ticketsData: SupportTicket[] = [];
      if (Array.isArray(response.data)) {
        ticketsData = response.data;
      } else if (response.data && typeof response.data === "object") {
        // Convert {"0": {...}, "1": {...}} to array
        ticketsData = Object.values(response.data);
      }

      console.log("Parsed tickets:", ticketsData.length);
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setTickets([]); // Set empty array on error
      Alert.alert(t("common.error"), t("support.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const getFilteredTickets = () => {
    // Ensure tickets is always an array
    const ticketsArray = Array.isArray(tickets) ? tickets : [];
    if (statusFilter === "all") {
      return ticketsArray;
    }
    return ticketsArray.filter((ticket) => ticket.status === statusFilter);
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
        return t("support.statusNew");
      case "in_progress":
        return t("support.statusInProgress");
      case "resolved":
        return t("support.statusResolved");
      case "closed":
        return t("support.statusClosed");
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    // Backend returns UTC time, need to add 7 hours for Vietnam timezone (UTC+7)
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - adjustedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return t("support.justNow");
    } else if (diffMins < 60) {
      return `${diffMins} ${t("support.minutesAgo")}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t("support.hoursAgo")}`;
    } else if (diffDays < 7) {
      return `${diffDays} ${t("support.daysAgo")}`;
    } else {
      return adjustedDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const handleTicketPress = (ticket: SupportTicket) => {
    (navigation as any).navigate("SupportRequestDetail", {
      ticketId: ticket.id,
    });
  };

  const handleTicketPressOld = (ticket: SupportTicket) => {
    // TODO: Navigate to ticket detail screen
    Alert.alert(
      ticket.title,
      `Trạng thái: ${getStatusLabel(ticket.status)}\n\n${ticket.description}`,
      [{ text: "Đóng" }]
    );
  };

  const handleCreateTicket = () => {
    // @ts-ignore
    navigation.navigate("CreateSupportRequest");
  };

  const filteredTickets = getFilteredTickets();

  const renderTicketCard = (ticket: SupportTicket) => (
    <TouchableOpacity
      key={ticket.id}
      style={styles.ticketCard}
      onPress={() => handleTicketPress(ticket)}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTitleContainer}>
          <Text style={styles.ticketTitle} numberOfLines={2}>
            {ticket.title}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(ticket.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(ticket.status)}</Text>
        </View>
      </View>

      {ticket.subject && (
        <View style={styles.ticketMeta}>
          <Ionicons name="folder-outline" size={14} color="#8E8E93" />
          <Text style={styles.ticketMetaText}>{ticket.subject.name}</Text>
        </View>
      )}

      {ticket.station && (
        <View style={styles.ticketMeta}>
          <Ionicons name="location-outline" size={14} color="#8E8E93" />
          <Text style={styles.ticketMetaText} numberOfLines={1}>
            {ticket.station.name}
          </Text>
        </View>
      )}

      <Text style={styles.ticketDescription} numberOfLines={2}>
        {ticket.description}
      </Text>

      <View style={styles.ticketFooter}>
        <Text style={styles.ticketDate}>{formatDate(ticket.created_at)}</Text>
        {ticket.support_images && ticket.support_images.length > 0 && (
          <View style={styles.imageIndicator}>
            <Ionicons name="image-outline" size={14} color="#8E8E93" />
            <Text style={styles.imageCount}>
              {ticket.support_images.length}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t("vehicle.loading")}</Text>
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
        <Text style={styles.headerTitle}>{t("support.myRequests")}</Text>
        <TouchableOpacity onPress={handleCreateTicket} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#34C759" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === "all" && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === "all" && styles.filterTabTextActive,
            ]}
          >
            {t("support.filterAll")} (
            {Array.isArray(tickets) ? tickets.length : 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === "open" && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter("open")}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === "open" && styles.filterTabTextActive,
            ]}
          >
            {t("support.filterOpen")} (
            {Array.isArray(tickets)
              ? tickets.filter((t) => t.status === "open").length
              : 0}
            )
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === "in_progress" && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter("in_progress")}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === "in_progress" && styles.filterTabTextActive,
            ]}
          >
            {t("support.filterInProgress")} (
            {Array.isArray(tickets)
              ? tickets.filter((t) => t.status === "in_progress").length
              : 0}
            )
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === "resolved" && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter("resolved")}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === "resolved" && styles.filterTabTextActive,
            ]}
          >
            {t("support.filterResolved")} (
            {Array.isArray(tickets)
              ? tickets.filter((t) => t.status === "resolved").length
              : 0}
            )
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === "closed" && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter("closed")}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === "closed" && styles.filterTabTextActive,
            ]}
          >
            {t("support.filterClosed")} (
            {Array.isArray(tickets)
              ? tickets.filter((t) => t.status === "closed").length
              : 0}
            )
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tickets List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>
              {statusFilter === "all"
                ? t("support.noRequests")
                : t("support.noRequests")}
            </Text>
            <Text style={styles.emptyStateText}>
              {statusFilter === "all"
                ? t("support.noRequestsDesc")
                : `${t("support.noRequests")} ${getStatusLabel(statusFilter)}`}
            </Text>
          </View>
        ) : (
          filteredTickets.map(renderTicketCard)
        )}
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
  addButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    maxHeight: 70,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: "#34C759",
  },
  filterTabText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
    textAlign: "center",
  },
  filterTabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: "#fff",
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
  ticketTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  ticketMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ticketMetaText: {
    fontSize: 13,
    color: "#8E8E93",
    marginLeft: 4,
    flex: 1,
  },
  ticketDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  ticketDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  imageIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageCount: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default SupportRequestScreen;
