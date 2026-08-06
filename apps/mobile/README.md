# SmartTask React Native Expo Mobile Application (`apps/mobile`)

A premium, production-quality React Native (Expo) mobile application built for **SmartTask**, consuming the Node.js Express TypeScript backend without modifying any database schemas or endpoints.

---

## 📱 Features

- **Authentication Suite**:
  - Email & Password Login with toggleable password visibility
  - Account Registration with strong password validation
  - 6-digit OTP Email Verification with resend timer
  - Forgot Password & 6-digit OTP Reset Password flow
  - Secure JWT storage via `expo-secure-store`
  - Automatic 401 refresh token interceptor flow

- **Dashboard & Overview**:
  - Welcome Banner with User Greeting
  - Real-time Metrics Grid (Total, Backlog, To Do, In Progress, Review, Completed)
  - Recent Activity Task Cards
  - Quick Tips & Quick Action Button (+ New Task)
  - Animated Pulse Skeletons while fetching statistics

- **Task Directory & Management**:
  - Debounced Title & Description Search
  - Horizontal Status & Priority Filter Chips
  - FlatList with Pull to Refresh & Infinite Scroll Pagination
  - Floating Action Button (+ New Task)
  - 3-Dots Task Action Bottom Sheet (View Details, Toggle Status, Edit, Delete)
  - Task Creation & Editing Modals with local timezone date formatting
  - Detailed Task Overview Modal

- **User Profile & Appearance Theme**:
  - User Initials Avatar & Account Email Verification status badge
  - Appearance Theme Switcher (Light / Dark / System mode) with `AsyncStorage` persistence
  - Edit Profile Name Modal
  - Change Password Modal
  - Sign Out confirmation dialog

- **Design System & UX**:
  - Notion / Linear / SaaS aesthetic (rounded corners, subtle borders, soft shadows)
  - Custom reusable component suite (`AppButton`, `AppInput`, `AppCard`, `AppBadge`, `AppHeader`, `AppSkeleton`, `AppModal`, `AppEmptyState`, `AppErrorState`, `AppStatCard`, `AppTaskCard`, `AppSearchBar`)
  - Offline & Connection Error screens with retry button

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd apps/mobile
npm install
```

### 2. Configure Backend API URL

Set your backend server URL in `apps/mobile/.env` or `EXPO_PUBLIC_API_URL`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
```

*Note: If testing on Android Emulator, use `http://10.0.2.2:5000/api/v1`. If testing on a physical mobile device, use your computer's local IP address (e.g. `http://192.168.1.50:5000/api/v1`).*

### 3. Run Development Server

```bash
# Start Expo development server
npm start

# Run on Android Emulator / Device
npm run android

# Run on iOS Simulator / Device
npm run ios
```

---

## 📦 APK / Production Build

To generate an Android APK build using Expo Application Services (EAS):

```bash
# Install EAS CLI globally (if not installed)
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build -p android --profile preview
```
