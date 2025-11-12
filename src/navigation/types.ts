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
  PinVerification: { sessionToken: string; kioskId: string; stationId: string };
  SwapSession: {
    sessionData?: {
      id: string;
      session_token: string;
      station_id: string;
      user_id: string;
      status: string;
      expires_at: string;
    };
    kioskId?: string;
    stationId?: string;
  };
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
  BuySwap: { preset?: number } | undefined;
  BuyPackage: undefined;
  OrderDetails: { order: any };
  PaymentSuccess: { order: any };
  // Profile screens
  EditProfile: undefined;
  Settings: undefined;
  AccountDetails: undefined;
  MyVehicles: undefined;
  AddVehicle: undefined;
  VehicleDetail: { vehicleId: string };
  EditVehicle: { vehicleId: string };
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

export type AppStackParamList = RootStackParamList;

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  EmailVerification: undefined;
  PinSetup: undefined;
  VehicleSetup: { userId?: string } | undefined;
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
