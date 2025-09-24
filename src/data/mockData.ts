// Mock data cho BSS App
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleModel: string;
  yearOfManufacture?: number;
  licensePlate: string;
  vin: string;
  batteryType: "A" | "B" | "C";
  profilePicture?: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // km
  estimatedTravelTime: number; // minutes
  operatingHours: {
    open: string;
    close: string;
  };
  batteries: {
    total: number;
    available: number;
    charging: number;
    maintenance: number;
  };
  availableBatteries: {
    A: number;
    B: number;
    C: number;
  };
  batteryTypes: ("A" | "B" | "C")[];
  rating: number;
  totalReviews: number;
  isOpen: boolean;
  status: "available" | "busy" | "maintenance" | "offline";
}

export interface Kiosk {
  id: string;
  stationId: string;
  name: string;
  status: "active" | "maintenance" | "offline";
}

export interface Reservation {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  batteryType: "A" | "B" | "C";
  estimatedArrival: Date;
  reservedAt: Date;
  expiredAt: Date;
  status: "active" | "completed" | "expired" | "cancelled";
}

export interface SwapTransaction {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  kioskId: string;
  batteryType: "A" | "B" | "C";
  oldBatteryId?: string;
  newBatteryId?: string;
  swapDate: Date;
  cost: number;
  paymentMethod: "pay-per-swap" | "subscription";
  status: "completed" | "failed" | "pending";
  rating?: number;
  comment?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  type: "unlimited" | "limited";
  name: string;
  price: number;
  duration: number; // days
  swapLimit?: number; // for limited type
  remainingSwaps?: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "pending" | "cancelled";
}

export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: "bank_transfer" | "momo" | "credit_card";
  type: "pay-per-swap" | "subscription";
  description: string;
  status: "success" | "pending" | "failed";
  invoiceId?: string;
}

export interface SupportRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: "battery_issue" | "kiosk_problem" | "payment_error" | "other";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

export interface StationRating {
  id: string;
  userId: string;
  stationId: string;
  transactionId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Mock Data
export const mockUser: User = {
  id: "1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  phone: "+84987654321",
  vehicleModel: "VinFast VF8",
  yearOfManufacture: 2023,
  licensePlate: "30A-12345",
  vin: "VF8XXXXXXXXXXXXXXX",
  batteryType: "A",
  profilePicture: "https://example.com/avatar.jpg",
};

export const mockStations: Station[] = [
  {
    id: "1",
    name: "Trạm Times City",
    address: "458 Minh Khai, Hai Bà Trưng, Hà Nội",
    latitude: 21.0118,
    longitude: 105.8634,
    distance: 2.5,
    estimatedTravelTime: 8,
    operatingHours: {
      open: "06:00",
      close: "22:00",
    },
    batteries: {
      total: 20,
      available: 12,
      charging: 6,
      maintenance: 2,
    },
    availableBatteries: {
      A: 5,
      B: 4,
      C: 3,
    },
    batteryTypes: ["A", "B", "C"],
    rating: 4.5,
    totalReviews: 245,
    isOpen: true,
    status: "available",
  },
  {
    id: "2",
    name: "Trạm Lotte Center",
    address: "54 Liễu Giai, Ba Đình, Hà Nội",
    latitude: 21.0285,
    longitude: 105.8372,
    distance: 3.2,
    estimatedTravelTime: 12,
    operatingHours: {
      open: "24/7",
      close: "24/7",
    },
    batteries: {
      total: 15,
      available: 8,
      charging: 5,
      maintenance: 2,
    },
    availableBatteries: {
      A: 5,
      B: 3,
      C: 0,
    },
    batteryTypes: ["A", "B"],
    rating: 4.2,
    totalReviews: 189,
    isOpen: true,
    status: "available",
  },
  {
    id: "3",
    name: "Trạm Keangnam",
    address: "E6 Phạm Hùng, Cầu Giấy, Hà Nội",
    latitude: 21.0291,
    longitude: 105.782,
    distance: 5.1,
    estimatedTravelTime: 18,
    operatingHours: {
      open: "05:00",
      close: "23:00",
    },
    batteries: {
      total: 25,
      available: 3,
      charging: 20,
      maintenance: 2,
    },
    availableBatteries: {
      A: 1,
      B: 1,
      C: 1,
    },
    batteryTypes: ["A", "B", "C"],
    rating: 4.7,
    totalReviews: 312,
    isOpen: true,
    status: "busy",
  },
  {
    id: "4",
    name: "Trạm Vincom Metropolis",
    address: "29 Liễu Giai, Ba Đình, Hà Nội",
    latitude: 21.0285,
    longitude: 105.8352,
    distance: 1.8,
    estimatedTravelTime: 6,
    operatingHours: {
      open: "06:30",
      close: "21:30",
    },
    batteries: {
      total: 18,
      available: 0,
      charging: 15,
      maintenance: 3,
    },
    availableBatteries: {
      A: 0,
      B: 0,
      C: 0,
    },
    batteryTypes: ["A", "C"],
    rating: 4.1,
    totalReviews: 156,
    isOpen: false,
    status: "maintenance",
  },
];

export const mockKiosks: Kiosk[] = [
  { id: "1-1", stationId: "1", name: "Kiosk 01", status: "active" },
  { id: "1-2", stationId: "1", name: "Kiosk 02", status: "active" },
  { id: "1-3", stationId: "1", name: "Kiosk 03", status: "maintenance" },
  { id: "2-1", stationId: "2", name: "Kiosk 01", status: "active" },
  { id: "2-2", stationId: "2", name: "Kiosk 02", status: "active" },
];

export const mockReservations: Reservation[] = [
  {
    id: "1",
    userId: "1",
    stationId: "1",
    stationName: "Trạm Times City",
    batteryType: "A",
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    reservedAt: new Date(),
    expiredAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    status: "active",
  },
  {
    id: "2",
    userId: "1",
    stationId: "2",
    stationName: "Trạm Lotte Center",
    batteryType: "A",
    estimatedArrival: new Date("2024-12-20T14:30:00"),
    reservedAt: new Date("2024-12-20T14:00:00"),
    expiredAt: new Date("2024-12-20T15:00:00"),
    status: "completed",
  },
];

export const mockSwapHistory: SwapTransaction[] = [
  {
    id: "1",
    userId: "1",
    stationId: "1",
    stationName: "Trạm Times City",
    kioskId: "1-1",
    batteryType: "A",
    oldBatteryId: "BAT-001",
    newBatteryId: "BAT-045",
    swapDate: new Date("2024-12-20T10:30:00"),
    cost: 50000,
    paymentMethod: "subscription",
    status: "completed",
    rating: 5,
    comment: "Dịch vụ nhanh chóng, pin chất lượng tốt!",
  },
  {
    id: "2",
    userId: "1",
    stationId: "2",
    stationName: "Trạm Lotte Center",
    kioskId: "2-1",
    batteryType: "A",
    oldBatteryId: "BAT-045",
    newBatteryId: "BAT-078",
    swapDate: new Date("2024-12-19T15:45:00"),
    cost: 55000,
    paymentMethod: "pay-per-swap",
    status: "completed",
    rating: 4,
    comment: "Tốt nhưng hơi lâu",
  },
  {
    id: "3",
    userId: "1",
    stationId: "3",
    stationName: "Trạm Keangnam",
    kioskId: "3-1",
    batteryType: "A",
    swapDate: new Date("2024-12-18T09:15:00"),
    cost: 52000,
    paymentMethod: "subscription",
    status: "completed",
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    userId: "1",
    type: "unlimited",
    name: "Gói không giới hạn - Tháng",
    price: 300000,
    duration: 30,
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-31"),
    status: "active",
  },
];

export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: "1",
    userId: "1",
    amount: 300000,
    paymentDate: new Date("2024-12-01T09:00:00"),
    paymentMethod: "bank_transfer",
    type: "subscription",
    description: "Gói không giới hạn - Tháng 12/2024",
    status: "success",
    invoiceId: "INV-001",
  },
  {
    id: "2",
    userId: "1",
    amount: 55000,
    paymentDate: new Date("2024-11-29T16:30:00"),
    paymentMethod: "momo",
    type: "pay-per-swap",
    description: "Đổi pin tại Trạm Lotte Center",
    status: "success",
    invoiceId: "INV-002",
  },
];

export const mockSupportRequests: SupportRequest[] = [
  {
    id: "1",
    userId: "1",
    title: "Pin bị nóng bất thường",
    description:
      "Pin vừa đổi tại trạm Times City bị nóng quá mức bình thường, xe báo lỗi.",
    category: "battery_issue",
    priority: "high",
    status: "in_progress",
    createdAt: new Date("2024-12-20T08:30:00"),
    updatedAt: new Date("2024-12-20T10:15:00"),
    images: ["battery-issue-1.jpg", "battery-issue-2.jpg"],
  },
  {
    id: "2",
    userId: "1",
    title: "Kiosk không nhận QR code",
    description:
      "Kiosk 02 tại trạm Lotte Center không thể quét QR code để đăng nhập",
    category: "kiosk_problem",
    priority: "medium",
    status: "resolved",
    createdAt: new Date("2024-12-18T14:20:00"),
    updatedAt: new Date("2024-12-19T09:45:00"),
  },
];

export const mockStationRatings: StationRating[] = [
  {
    id: "1",
    userId: "1",
    stationId: "1",
    transactionId: "1",
    rating: 5,
    comment: "Dịch vụ tuyệt vời, pin chất lượng cao!",
    createdAt: new Date("2024-12-20T10:35:00"),
  },
  {
    id: "2",
    userId: "1",
    stationId: "2",
    transactionId: "2",
    rating: 4,
    comment: "Tốt nhưng thời gian chờ hơi lâu",
    createdAt: new Date("2024-12-19T15:50:00"),
  },
];

// Vehicle Models với Battery Type mapping
export const vehicleModels = [
  { model: "VinFast VF8", batteryType: "A" as const },
  { model: "VinFast VF9", batteryType: "B" as const },
  { model: "VinFast VF5", batteryType: "A" as const },
  { model: "VinFast VF6", batteryType: "A" as const },
  { model: "VinFast VF7", batteryType: "B" as const },
  { model: "VinFast VF3", batteryType: "C" as const },
];

// Battery Types Info
export const batteryTypes = {
  A: { name: "Pin A", capacity: "75kWh", range: "420km" },
  B: { name: "Pin B", capacity: "90kWh", range: "500km" },
  C: { name: "Pin C", capacity: "45kWh", range: "285km" },
};

// Subscription Plans
export const subscriptionPlans = [
  {
    id: "unlimited-month",
    type: "unlimited" as const,
    name: "Gói không giới hạn - Tháng",
    price: 300000,
    duration: 30,
    description: "Đổi pin không giới hạn trong 30 ngày",
  },
  {
    id: "limited-10",
    type: "limited" as const,
    name: "Gói 10 lần/tháng",
    price: 250000,
    duration: 30,
    swapLimit: 10,
    description: "10 lần đổi pin trong 30 ngày",
  },
  {
    id: "unlimited-week",
    type: "unlimited" as const,
    name: "Gói không giới hạn - Tuần",
    price: 100000,
    duration: 7,
    description: "Đổi pin không giới hạn trong 7 ngày",
  },
];

// Consolidated mock data object
export const mockData = {
  user: mockUser,
  stations: mockStations,
  kiosks: mockKiosks,
  reservations: mockReservations,
  swapHistory: mockSwapHistory,
  subscriptions: mockSubscriptions,
  paymentHistory: mockPaymentHistory,
  supportRequests: mockSupportRequests,
  vehicleModels,
  batteryTypes,
  subscriptionPlans,
};
