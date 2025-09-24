// Navigation types for the BSS App
export type RootStackParamList = {
  Splash: undefined;
  AuthStack: undefined;
  AppStack: undefined;
  MainTabs: undefined;
  // Station screens
  StationDetails: { stationId: string };
  StationMap: {
    searchParams?: { distance?: number; batteryType?: string; query?: string };
  };
  // Swap screens
  QRScan: undefined;
  SwapSession: { stationId: string };
  SwapSuccess: { swapData: any };
  SwapHistory: undefined;
  // Payment screens
  PaymentMethods: undefined;
  TopUp: undefined;
  PaymentHistory: undefined;
  PaymentScreen: {
    amount: number;
    type: "swap" | "subscription" | "topup";
    subscriptionId?: string;
  };
  // Profile screens
  EditProfile: undefined;
  Settings: undefined;
  // Other screens
  ReservationConfirm: { stationId: string; estimatedArrival?: Date };
  KioskSession: { reservationId?: string; stationId: string };
  InvoiceScreen: { paymentId: string };
  SupportDetail: { requestId: string };
  StationRating: { transactionId: string; stationId: string };
  VehicleProfile: undefined;
  Subscription: undefined;
  SubscriptionDetail: { subscriptionId: string };
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: { phone: string; email: string };
  VehicleSetup: { userId: string };
};

export type MainTabParamList = {
  Home: undefined; // 1. Home (Stations) - Entry point
  MyReservations: undefined; // 2. Reservations - Quản lý pin đã đặt
  QRScan: undefined; // 3. Scan QR - CENTER TAB - Action chính
  History: undefined; // 4. History - Swap & Payment History
  Profile: undefined; // 5. Profile - Account, Settings, Support
};

export type StationTabParamList = {
  StationList: undefined;
  StationMap: {
    searchParams?: { distance?: number; batteryType?: string; query?: string };
  };
};

export type HistoryTabParamList = {
  SwapHistory: undefined;
  PaymentHistory: undefined;
};

export type ProfileTabParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Support: undefined;
  Subscription: undefined;
  VehicleProfile: undefined;
};
