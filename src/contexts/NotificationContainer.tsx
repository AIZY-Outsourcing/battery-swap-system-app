import React from "react";
import { View } from "react-native";
import CustomNotification from "../components/CustomNotification";
import { useNotification } from "./NotificationContext";

export const NotificationContainer: React.FC = () => {
  const { notification, hideNotification } = useNotification();

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <CustomNotification
        notification={notification}
        onHide={hideNotification}
      />
    </View>
  );
};
