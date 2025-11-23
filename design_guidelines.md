# Design Guidelines: Internet Customer Management App

## Platform & Architecture

### Platform
- **Android-first application** following Material Design 3 guidelines
- Support for RTL (right-to-left) layouts for Arabic interface
- Adaptive layouts for phones and tablets

### Authentication
- **No authentication required** - This is a single-user utility app
- Data stored locally with optional Google Drive sync
- Include a basic profile/settings screen with app preferences

### Navigation Structure
**Tab Navigation (3 tabs):**
1. **Customers Tab (العملاء)** - Main list view with search
2. **Add Customer Tab (+)** - Centered, primary action in tab bar
3. **Settings Tab (الإعدادات)** - App preferences and sync

Navigation should support RTL/LTR switching based on selected language.

## Screen Specifications

### 1. Customers List Screen (الرئيسية)
**Purpose:** Browse, search, and manage customer database

**Layout:**
- Transparent header with search bar (collapsible on scroll)
- Right button: Filter/Sort icon
- Left button: Export to Excel icon
- Scrollable list of customer cards
- Floating Action Button: Quick add (redundant with tab, optional)
- Safe area insets: 
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

**Components:**
- Search bar with real-time filtering
- Customer cards showing: Serial #, Name, Location, IP Address
- Swipe actions: Edit (right), Delete (left)
- Empty state with illustration when no customers
- Sync status indicator (top-right): synced/syncing/offline icons

### 2. Add/Edit Customer Screen
**Purpose:** Input or modify customer data

**Layout:**
- Default navigation header with title "Add Customer" or "Edit Customer"
- Left button: Cancel/Back
- Right button: Save (enabled only when form is valid)
- Scrollable form area
- Safe area insets:
  - Top: Spacing.xl (header is opaque)
  - Bottom: insets.bottom + Spacing.xl

**Form Fields (in order):**
1. Serial Number (رقم تسلسلي) - Auto-generated, editable
2. Location (الموقع) - Text input
3. Name (الاسم) - Text input
4. Point Name (اسم النقطة) - Text input
5. Network Name (اسم الشبكة) - Text input
6. Network Password (كلمة مرور الشبكة) - Secure input with show/hide toggle
7. Username (اسم المستخدم) - Text input
8. User Password (كلمة المرور) - Secure input with show/hide toggle
9. IP Address (عنوان IP) - Keyboard optimized for IP input
10. Gateway IP (IP Gateway) - Keyboard optimized for IP input
11. Package Speed (سرعة الباقة) - Dropdown or numeric input with unit (Mbps)
12. Package Size (حجم الباقة) - Dropdown or numeric input with unit (GB)

**Interaction:**
- Required fields marked with red asterisk
- Inline validation with helpful error messages
- Keyboard dismisses on scroll
- Confirmation dialog on Cancel if form is dirty

### 3. Settings Screen (الإعدادات)
**Purpose:** Configure app preferences and Google Drive sync

**Layout:**
- Default navigation header with title "Settings"
- Scrollable grouped settings list
- Safe area insets:
  - Top: Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

**Settings Groups:**

**Appearance (المظهر)**
- Theme toggle: Light / Dark / System
- Language toggle: English / العربية
- Visual preview of selected theme

**Google Drive Sync (مزامنة Google Drive)**
- Account status card showing:
  - Connected account email or "Not connected"
  - Last sync timestamp
  - Storage usage indicator
- Sign In / Sign Out button (primary)
- Switch Account button (if signed in)
- Manual Sync button with loading spinner when active
- Auto-sync toggle switch with description
- Sync status: "Synced", "Syncing...", "Offline", "Error"

**Data Management (إدارة البيانات)**
- Export to Excel button
- Manage Custom Fields (navigate to field editor)
- Clear all data (with double confirmation)

**About**
- App version
- Privacy policy link (placeholder)

## Design System

### Color Palette
**Light Theme:**
- Primary: #2196F3 (Material Blue)
- Primary Container: #E3F2FD
- Secondary: #4CAF50 (Success green for sync indicators)
- Error: #F44336
- Background: #FFFFFF
- Surface: #F5F5F5
- Surface Variant: #EEEEEE
- On Surface: #212121
- On Surface Variant: #757575

**Dark Theme:**
- Primary: #90CAF9
- Primary Container: #1565C0
- Secondary: #81C784
- Error: #EF5350
- Background: #121212
- Surface: #1E1E1E
- Surface Variant: #2C2C2C
- On Surface: #E0E0E0
- On Surface Variant: #BDBDBD

### Typography
**Arabic (Noto Sans Arabic):**
- Display: 32sp, Bold
- Headline: 24sp, SemiBold
- Title: 20sp, Medium
- Body Large: 16sp, Regular
- Body: 14sp, Regular
- Label: 12sp, Medium

**English (Roboto):**
- Display: 32sp, Bold
- Headline: 24sp, Medium
- Title: 20sp, Medium
- Body Large: 16sp, Regular
- Body: 14sp, Regular
- Label: 12sp, Medium

### Spacing Scale
- xs: 4dp
- sm: 8dp
- md: 12dp
- lg: 16dp
- xl: 24dp
- xxl: 32dp

### Component Specifications

**Customer Card:**
- Elevated surface (2dp elevation)
- Rounded corners: 12dp
- Padding: lg
- Border: 1dp solid Surface Variant
- Ripple effect on press
- Swipe threshold: 60dp

**Form Inputs:**
- Outlined text fields (Material Design 3)
- Corner radius: 8dp
- Label color: On Surface Variant
- Focus color: Primary
- Error color: Error
- Height: 56dp

**Buttons:**
- Primary: Filled button, corner radius 8dp
- Secondary: Outlined button, corner radius 8dp
- Text buttons for tertiary actions
- Ripple feedback on all buttons
- Minimum touch target: 48dp × 48dp

**Floating Action Button (if used):**
- Size: 56dp diameter
- Elevation: 6dp
- Shadow specifications:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Icon: Feather "plus" icon, 24dp

**Toggle Switches:**
- Material Design 3 switches
- Active color: Primary
- Inactive color: Surface Variant
- Smooth animation (200ms)

### Icons
- Use Material Icons or Feather icons from @expo/vector-icons
- Icon size: 24dp for navigation, 20dp for inline actions
- Color: On Surface for default, Primary for active states

**Key Icons:**
- Search: "search"
- Filter: "filter-list"
- Export: "file-download"
- Sync: "sync" (animated rotation when syncing)
- Add: "add"
- Edit: "edit"
- Delete: "delete"
- Settings: "settings"
- Account: "account-circle"
- Theme: "brightness-6"
- Language: "translate"

### Visual Feedback
- All touchable elements have ripple effect
- Form validation shows inline errors below fields
- Success/error toasts for sync operations
- Loading spinners for async operations
- Pull-to-refresh on customer list

### Accessibility
- Minimum contrast ratio: 4.5:1 for text
- All interactive elements minimum 48dp touch target
- Screen reader support for all critical actions
- RTL layout support with proper text alignment
- Descriptive labels for all form fields in both languages

### Assets Required
**None** - This app uses system icons and text-based UI. All data is user-generated. Use Material Icons for all interface elements.

### Localization
- Full support for Arabic (RTL) and English (LTR)
- Dynamic layout switching based on language
- All UI strings in translation files
- Number formatting: Western numerals in English, Eastern numerals optional in Arabic
- Date formatting: Follow system locale preferences