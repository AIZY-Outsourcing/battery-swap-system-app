// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  membershipLevel: "bronze" | "silver" | "gold" | "platinum";
  emailVerified?: boolean;
  role?: string;
  vehicles?: Array<{
    id?: string;
    make?: string;
    model?: string;
    year?: number | string;
    licensePlate?: string;
    vin?: string;
    batteryType?: string;
  }>;
  swapCredits?: number;
  vehicle?: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    batteryType: string;
  };
}

// Station types
export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
  availableSlots: number;
  totalSlots: number;
  status: "available" | "busy" | "maintenance";
  amenities: string[];
  operatingHours: {
    open: string;
    close: string;
  };
}

// Battery types
export interface Battery {
  id: string;
  type: string;
  capacity: number;
  health: number;
  cycleCount: number;
  manufacturer: string;
}

// Vehicle types
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  batteryType: string;
  isActive: boolean;
}

// Reservation types
export interface Reservation {
  id: string;
  userId: string;
  stationId: string;
  slotId: string;
  date: string;
  timeSlot: string;
  status: "active" | "completed" | "cancelled" | "expired";
  createdAt: string;
}

// Swap transaction types
export interface SwapTransaction {
  id: string;
  userId: string;
  stationId: string;
  reservationId?: string;
  startTime: string;
  endTime?: string;
  batteryBefore: Battery;
  batteryAfter?: Battery;
  cost: number;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  duration?: number; // in minutes
  paymentMethod: "card" | "wallet" | "subscription";
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: "card" | "digital_wallet";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  swapsIncluded: number;
  swapsUsed: number;
  status: "active" | "cancelled" | "expired";
  nextBillingDate: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
