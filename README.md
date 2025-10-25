# BSS App - EV Battery Swapping Driver App

A React Native + Expo application for electric vehicle battery swapping services.

## 🚗 Features

- **Authentication**: Email/phone + OTP verification
- **Profile Management**: User profiles & vehicle linking
- **Station Discovery**: Station list with map integration & reservations
- **Kiosk Integration**: QR code session management
- **Swap Transactions**: Real-time battery swapping process
- **Payment System**: Pay-per-swap + subscription models
- **History & Support**: Transaction history, customer support, and rating system

## 📁 Project Structure

```
bss-app/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── ui/             # Basic UI components
│   │   └── common/         # Common app-specific components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication flows
│   │   ├── station/        # Station discovery & details
│   │   ├── reservation/    # Booking & reservations
│   │   ├── kiosk/          # Kiosk session management
│   │   ├── profile/        # User profile management
│   │   ├── payment/        # Payment processing
│   │   ├── history/        # Transaction history
│   │   └── support/        # Customer support
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API services & external integrations
│   │   ├── api/           # API service classes
│   │   ├── auth/          # Authentication services
│   │   └── location/      # Location services
│   ├── store/             # State management (Redux/Zustand)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   │   ├── validation/    # Form validation
│   │   └── helpers/       # Helper functions
│   ├── constants/         # App constants
│   └── types/             # TypeScript type definitions
├── scripts/               # Development scripts
└── assets/               # Static assets
```

## 🛠 Setup & Installation

1. **Prerequisites**

   ```bash
   # Install Node.js (v18 or higher)
   # Install Expo CLI
   npm install -g @expo/cli
   ```

2. **Project Setup**

   ```bash
   # Clone the repository
   git clone <repository-url>
   cd bss-app

   # Install dependencies
   npm install

   # Create the folder structure
   chmod +x scripts/create_structure.sh
   ./scripts/create_structure.sh
   ```

3. **Install Required Dependencies**

   ```bash
   # Navigation
   npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
   npx expo install react-native-screens react-native-safe-area-context

   # State Management (choose one)
   npm install @reduxjs/toolkit react-redux
   # OR
   npm install zustand

   # Additional utilities
   npm install react-native-vector-icons
   npm install @react-native-async-storage/async-storage
   ```

4. **Start Development**

   ```bash
   # Start the Expo development server
   npx expo start

   # Run on iOS simulator
   npx expo start --ios

   # Run on Android emulator
   npx expo start --android
   ```

## 🏗 Architecture

### Navigation Structure

- **AuthStack**: Welcome, Login, Register, OTP Verification
- **MainTabs**: Home, Stations, History, Profile
- **Modals**: Station Details, Kiosk Session, Payment

### State Management

- Authentication state
- User profile & vehicle data
- Station & reservation data
- Transaction history
- App preferences

### Services

- **AuthService**: User authentication & session management
- **StationService**: Station discovery & details
- **ReservationService**: Booking management
- **PaymentService**: Payment processing
- **LocationService**: GPS & mapping functionality

## 🎨 Design System

### Colors

- Primary: `#007AFF` (iOS Blue)
- Secondary: `#f8f9fa` (Light Gray)
- Success: `#4CAF50` (Green)
- Warning: `#FF9800` (Orange)
- Error: `#F44336` (Red)

### Typography

- Headings: Inter/SF Pro Display
- Body: Inter/SF Pro Text
- Monospace: SF Mono

### Components

- **Button**: Primary, secondary, outline variants
- **Card**: Content containers with elevation
- **LoadingSpinner**: Loading states
- **Input**: Form inputs with validation

## 📱 Screens Overview

### Authentication Flow

1. **Welcome**: App introduction & CTA
2. **Login**: Email/password or phone login
3. **Register**: User registration form
4. **OTP Verification**: SMS verification

### Main App Flow

1. **Home**: Dashboard with quick actions & stats
2. **Stations**: Map/list view of nearby stations
3. **Reservation**: Time slot booking
4. **Kiosk**: QR session & swap process
5. **Payment**: Payment methods & processing
6. **History**: Transaction history & details
7. **Profile**: User settings & vehicle management

## 🔧 Development Guidelines

### File Naming

- Components: `PascalCase.tsx`
- Screens: `ScreenName.tsx`
- Services: `ServiceName.ts`
- Utilities: `camelCase.ts`

### Code Organization

- Group related functionality in features
- Keep components small and focused
- Use TypeScript for type safety
- Follow React Native best practices

### Testing

```bash
# Unit tests
npm run test

# E2E tests (if configured)
npm run e2e
```

### API Logging

- Verbose logs for every API request/response are enabled in development by default.
- To force-enable in other environments, set an Expo public env var:

```bash
EXPO_PUBLIC_DEBUG_API_LOGS=true
```

Logs include method, URL, status, duration, and trimmed bodies. Sensitive headers like Authorization are masked.

## 🚀 Deployment

### Development Build

```bash
npx expo build:android
npx expo build:ios
```

### Production Build

```bash
npx expo build:android --type app-bundle
npx expo build:ios --type archive
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**BSS App v1.0.0** - Built with React Native + Expo
