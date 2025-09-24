#!/bin/bash

# BSS App - Create Project Structure Script
# This script creates the feature-based folder structure for the Battery Swapping Station app

echo "Creating BSS App folder structure..."

# Create main src directory
mkdir -p src

# Create navigation directory
mkdir -p src/navigation

# Create feature directories
mkdir -p src/features/auth/screens
mkdir -p src/features/auth/components
mkdir -p src/features/auth/services
mkdir -p src/features/station/screens
mkdir -p src/features/station/components
mkdir -p src/features/station/services
mkdir -p src/features/reservation/screens
mkdir -p src/features/reservation/components
mkdir -p src/features/reservation/services
mkdir -p src/features/kiosk/screens
mkdir -p src/features/kiosk/components
mkdir -p src/features/kiosk/services
mkdir -p src/features/profile/screens
mkdir -p src/features/profile/components
mkdir -p src/features/payment/screens
mkdir -p src/features/payment/components
mkdir -p src/features/history/screens
mkdir -p src/features/history/components
mkdir -p src/features/support/screens
mkdir -p src/features/support/components

# Create shared directories
mkdir -p src/components/ui
mkdir -p src/components/common
mkdir -p src/services/api
mkdir -p src/services/auth
mkdir -p src/services/location
mkdir -p src/store/slices
mkdir -p src/utils/validation
mkdir -p src/utils/helpers
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/constants

echo "✅ All directories created successfully!"
echo "📁 Project structure is ready for development"