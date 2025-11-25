# Overview

This is a **React Native mobile application** built with **Expo** for managing internet customer data. The app is designed as a **single-user, offline-first utility** that allows users to track customer information such as network credentials, IP addresses, and subscription details. The application supports **bilingual interface** (Arabic and English) with **RTL/LTR layout switching**, and includes optional **Google Drive synchronization** for data backup.

The app follows **Material Design 3 principles** and provides a tab-based navigation structure with features for adding, editing, searching, and exporting customer records. Data is stored locally using AsyncStorage with optional cloud sync capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Navigation:**
- Built with **Expo SDK 54** and **React Native 0.81.5**
- Uses **React Navigation** with bottom tab navigator for main navigation
- Implements **native stack navigator** for nested settings screens
- Supports **file-based routing** (secondary NetCustomers folder shows expo-router pattern)

**UI Architecture:**
- **Themed component system** with light/dark mode support
- Custom themed components (ThemedView, ThemedText) that consume theme context
- **Reanimated 2** for smooth animations and gesture handling
- **Material Design 3** color system with elevation-based backgrounds
- Platform-specific implementations (iOS blur effects, Android edge-to-edge)

**State Management:**
- **Context API** for global state (4 main contexts):
  - `CustomerContext` - Customer data and field configuration
  - `LanguageContext` - i18n with Arabic/English translations
  - `ThemeContext` - Theme mode (light/dark/system) management
  - `SyncContext` - Background sync orchestration
- **React hooks** for local component state

**Key Design Patterns:**
- Provider pattern for context composition (nested providers in App.tsx)
- Custom hooks for theme, language, and screen insets
- Error boundary for graceful error handling
- Screen wrapper components (ScreenScrollView, ScreenFlatList) for consistent layouts

## Data Storage & Persistence

**Local Storage:**
- **AsyncStorage** as primary data persistence layer
- Stores three main data types:
  - Customer records (array of Customer objects)
  - Custom field configurations (CustomerField definitions)
  - Sync settings and metadata, Excel file URI
- No database layer - direct JSON serialization

**Excel File Integration (NEW):**
- **File picker** (expo-document-picker) allows users to browse and select Excel files from device storage
- **Read from Excel**: Parse customer data from .xlsx files directly into the app
- **Write to Excel**: Export customer records to selected .xlsx file with real-time updates
- Stores selected file URI in AsyncStorage for persistence across app sessions
- Full read/write support with field mapping

**Data Model:**
- **Dynamic field system** - Fields are configurable, not hardcoded
- Default 12 fields defined in `types/customer.ts`
- Each customer has: id, timestamps, 12+ configurable fields, favorites flag
- Fields support types: text, password, ip, number
- Field ordering and required/optional flags are customizable

## External Dependencies

**Cloud Services:**
- **Google Drive API** integration for optional backup/sync (NOW FULLY FUNCTIONAL)
- Uses Replit Connectors for OAuth token management with automatic token refresh
- Real OAuth flow through Replit's connector infrastructure
- Syncs customer database as JSON file to Google Drive
- **Auto-sync modes**: Triggered when device connects to internet (if enabled)
- **Debounced sync**: 10-second minimum interval to prevent rate limiting
- **Manual sync**: Available anytime from settings
- **Connection status**: Shows current connection state in settings

**Export & Sharing:**
- **XLSX library** for Excel export functionality (mobile-optimized)
- Fixed file-based export for APK builds using FileSystem cache directory
- **expo-print** for PDF generation from customer details
- **expo-sharing** for native share sheet integration
- **expo-file-system** for temporary file handling and cleanup
- Fallback data URI support for compatibility

**Camera & QR Code:**
- **expo-camera** for QR code scanning
- **react-native-qrcode-svg** for QR code generation
- Customer data encoded in QR codes for quick lookup

**UI & UX Libraries:**
- **expo-blur** for iOS frosted glass effects
- **expo-haptics** for tactile feedback
- **react-native-keyboard-controller** for keyboard-aware scrolling
- **react-native-gesture-handler** for swipe actions and gestures
- **@react-native-community/netinfo** for online/offline detection

**Development Tools:**
- **EAS Build** configured for APK generation
- Custom build scripts for Replit deployment
- TypeScript with strict mode enabled
- Module resolution aliases (@/ for root imports)

**Platform Support:**
- Primary: **Android** (Material Design focused)
- Secondary: iOS (with conditional SF Symbols)
- Tertiary: Web (with fallbacks for native-only features)

## Recent Features Added (November 25, 2025)

### 1. **Phone Number Field**
- Added phone number field (appears after name field)
- Phone field appears in customer cards
- Phone number can be entered when adding/editing customers
- Used for contact functionality

### 2. **Contact Functionality**
- Contact button on each customer card (if phone number is available)
- Contact options: Call, SMS, WhatsApp, Telegram
- Opens default app when selected
- Also available in multi-select mode for single selected customer

### 3. **Improved UI Layout**
- Reduced spacing between view mode buttons and first card
- Point name field renamed to "Internet Point Name" (نقطة الإنترنت)
- Better visual hierarchy

## Previous Features (November 24, 2025)

### 1. **Bulk Delete with Multi-Select Mode**
- Long-press any customer card to activate multi-select mode
- Floating action button (check-square icon) toggles multi-select
- Select multiple customers by tapping in multi-select mode
- Floating delete button in multi-select bar for batch deletion
- Shows count of selected customers

### 2. **Advanced Filters**
- Filter button (sliders icon) opens advanced filter panel
- Filter options:
  - **Favorites Only**: Toggle to show only favorite customers
  - **By Location**: Quick filter by location from existing locations
  - **By Month**: Filter by subscription month (YYYY-MM format)
- Reset button clears all filters
- Filters combine with search query for powerful data discovery

### 3. **Live Excel Sync**
- Excel import button (file-excel icon) in search bar
- Browse and select Excel files directly from device storage
- Two sync modes:
  - **Replace**: Overwrites all current customer data with Excel data
  - **Merge**: Combines Excel data with existing customers
- Reads customer data directly from live Excel files
- Automatic field mapping to customer records