import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "History">;

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export default function ReservationScreen() {
  const [selectedDate, setSelectedDate] = useState("2024-03-20");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock data - replace with API call
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00 AM", available: true },
    { id: "2", time: "09:30 AM", available: false },
    { id: "3", time: "10:00 AM", available: true },
    { id: "4", time: "10:30 AM", available: true },
    { id: "5", time: "11:00 AM", available: false },
    { id: "6", time: "11:30 AM", available: true },
    { id: "7", time: "12:00 PM", available: true },
    { id: "8", time: "12:30 PM", available: true },
  ];

  const handleReservation = () => {
    if (!selectedTimeSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    Alert.alert(
      "Confirm Reservation",
      `Do you want to reserve a slot for ${selectedDate} at ${
        timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => Alert.alert("Success", "Reservation confirmed!"),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reserve a Slot</Text>
        <Text style={styles.subtitle}>Downtown Station - 123 Main St</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[styles.dateButton, styles.selectedDate]}
            onPress={() => setSelectedDate("2024-03-20")}
          >
            <Text style={styles.dateText}>Today</Text>
            <Text style={styles.dateSubtext}>Mar 20</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setSelectedDate("2024-03-21")}
          >
            <Text style={styles.dateText}>Tomorrow</Text>
            <Text style={styles.dateSubtext}>Mar 21</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setSelectedDate("2024-03-22")}
          >
            <Text style={styles.dateText}>Fri</Text>
            <Text style={styles.dateSubtext}>Mar 22</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                !slot.available && styles.timeSlotDisabled,
                selectedTimeSlot === slot.id && styles.timeSlotSelected,
              ]}
              onPress={() => slot.available && setSelectedTimeSlot(slot.id)}
              disabled={!slot.available}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  !slot.available && styles.timeSlotTextDisabled,
                  selectedTimeSlot === slot.id && styles.timeSlotTextSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.reservationInfo}>
        <Text style={styles.infoTitle}>Reservation Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Station:</Text>
          <Text style={styles.infoValue}>Downtown Station</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{selectedDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>
            {selectedTimeSlot
              ? timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time
              : "Not selected"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>15 minutes</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.reserveButton,
          !selectedTimeSlot && styles.reserveButtonDisabled,
        ]}
        onPress={handleReservation}
        disabled={!selectedTimeSlot}
      >
        <Text style={styles.reserveButtonText}>Reserve Slot</Text>
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
    fontSize: 24,
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
  dateContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  dateSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    width: "22%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeSlotSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  timeSlotDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#eee",
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  timeSlotTextDisabled: {
    color: "#999",
  },
  reservationInfo: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  reserveButton: {
    backgroundColor: "#007AFF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
