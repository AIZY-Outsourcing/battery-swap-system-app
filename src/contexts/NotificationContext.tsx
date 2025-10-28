import React, { createContext, useContext, useState, useCallback } from "react";
import { NotificationData } from "./CustomNotification";

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  hideNotification: () => void;
  notification: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = useCallback((notificationData: Omit<NotificationData, "id">) => {
    const id = Date.now().toString();
    setNotification({
      ...notificationData,
      id,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        notification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
