# DegDeg (2022)

A ride-sharing platform built with React Native, featuring separate apps for passengers and drivers.

## 📱 Project Structure

This is a monorepo managed with Lerna and Yarn Workspaces containing three packages:

```
packages/
├── passenger/          # Passenger mobile app
├── driver/            # Driver mobile app
└── common/            # Shared components, utilities, and types
```

## 🛠 Tech Stack

- **Framework**: React Native 0.65
- **Language**: TypeScript
- **State Management**: Recoil
- **Navigation**: React Navigation v6
- **Backend**: Firebase
  - Authentication
  - Firestore
  - Cloud Functions
  - Cloud Storage
  - Analytics
  - Crashlytics
  - Cloud Messaging
- **Maps**: React Native Maps + Directions
- **Payments**: Stripe (passenger app)
- **Geolocation**: react-native-geolocation-service + geofirestore
- **Monorepo Management**: Lerna + Yarn Workspaces

## 🚀 Getting Started

### Prerequisites

- Node.js
- Yarn
- React Native development environment set up
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Install dependencies
yarn install

# Install pods for iOS (run from root)
cd packages/passenger/ios && pod install && cd ../../..
cd packages/driver/ios && pod install && cd ../../..
```

## 📦 Available Scripts

### Passenger App

```bash
# Start Metro bundler
yarn start:passenger

# Run on Android
yarn android:passenger

# Run on iOS
yarn ios:passenger
```

### Driver App

```bash
# Start Metro bundler
yarn start:driver

# Run on Android
yarn android:driver

# Run on iOS
yarn ios:driver
```

## 🏗 Architecture

### Common Package (`@dagdag/common`)

Shared resources between passenger and driver apps:
- UI components
- Type definitions
- Utilities and helpers
- Constants
- Custom hooks
- Theme configuration
- Firebase services

### Passenger App (`@dagdag/passenger`)

Features:
- User authentication
- Book rides (immediate and scheduled)
- Track driver location in real-time
- Payment integration with Stripe
- Ride history
- User profile management

### Driver App (`@dagdag/driver`)

Features:
- Driver authentication
- Accept/reject ride requests
- Navigation to pickup and destination
- Real-time location tracking
- Earnings tracking
- Driver profile management

## 🔧 Configuration

### Firebase Setup

1. Create Firebase projects for your apps
2. Download and add configuration files:
   - iOS: `GoogleService-Info.plist` to `ios/` directory
   - Android: `google-services.json` to `android/app/` directory
3. Configure Firebase Functions (see `firebase.json`)

### Environment Variables

Create `.env` files in each app package with required configuration:

```env
# Add your API keys and configuration
GOOGLE_MAPS_API_KEY=your_api_key
# ... other environment variables
```

## 📱 Development

The monorepo uses Yarn workspaces with specific nohoist configuration for React Native dependencies to ensure proper dependency resolution.

When making changes to the `common` package, both apps will automatically pick up the changes during development.

## 🔨 CI/CD

This project uses Codemagic for continuous integration and deployment. See `codemagic.yaml` for build configuration.