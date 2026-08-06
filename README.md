# ⚡ SmartTask Management Application

SmartTask is a full-featured, production-ready Task Management Monorepo comprising an **Express Node.js TypeScript Backend**, a **Next.js 15 Web Application**, and a **React Native Expo Mobile Application**.

---

## 🏗️ Architecture & Monorepo Structure

```text
smarttask/
├── apps/
│   ├── backend/             # Node.js, Express, TypeScript, MongoDB, JWT Auth, Swagger, Cron Worker
│   ├── frontend/            # Next.js 15 (App Router), React 19, Tailwind CSS, React Query
│   └── mobile/              # React Native, Expo SDK 52, NativeWind, Expo Router, Secure Store
└── README.md
```

---

## ✨ Features Across Applications

### 🛠️ Backend API (`apps/backend`)
- **Authentication & Security**: Secure JWT Access & Refresh Token rotation, Bcrypt password hashing, Helmet headers security, CORS policies, Express rate limiting, and HttpOnly cookies.
- **Email Verification & Security**: 6-digit OTP email verification and forgot/reset password workflows.
- **Task & User Management**: Full CRUD capabilities, pagination, status transitions, priority filtering, and user profiles.
- **Background Cron Worker**: Automated task reminder notification system powered by `node-cron`.
- **API Documentation**: Live interactive Swagger API documentation generated at `/api-docs`.
- **Validation**: Strict request validation using Zod schemas.

### 🌐 Web Client (`apps/frontend`)
- **Modern Tech Stack**: Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS.
- **State Management**: Optimized data fetching and caching using React Query (`@tanstack/react-query`).
- **Interactive UI**: Analytics overview dashboard, customizable task data tables, status/priority filters, search, and dynamic forms with React Hook Form + Zod.
- **Theme Support**: Seamless dark and light mode toggle powered by `next-themes`.

### 📱 Mobile App (`apps/mobile`)
- **Cross-Platform Expo Router**: iOS and Android mobile app built with Expo SDK 52 and file-based routing (`expo-router`).
- **Styling & UX**: NativeWind v4 (Tailwind CSS for React Native), animated skeletons, bottom action sheets, and custom UI components.
- **Secure Persistence**: Sensitive auth tokens stored using `expo-secure-store` and user settings using `AsyncStorage`.
- **Mobile Workflows**: OTP verification screens, quick task creation, pull-to-refresh lists, debounced search, and theme preferences.

---

## ⚙️ Environment Configuration

Before running the applications, create the appropriate `.env` files in each sub-application directory.

### 1. Backend (`apps/backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CORS_ORIGIN=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
OTP_EXPIRY_MINUTES=10

# Task Reminder Cron
CRON_EXPRESSION=* * * * *
```

### 2. Frontend (`apps/frontend/.env`)
```env
NEXT_PUBLIC_API_URL_BASE=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
```

### 3. Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
```
*Note for Mobile Testing:*
- **Android Emulator**: Use `http://10.0.2.2:5000/api/v1`
- **Physical Device**: Use host local IP (e.g., `http://192.168.x.x:5000/api/v1`)

---

## 🚀 Getting Started

### 1. Backend API
```bash
cd apps/backend
npm install
npm run dev
```
- **API Base URL**: `http://localhost:5000/api/v1`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

### 2. Web Application
```bash
cd apps/frontend
npm install
npm run dev
```
- **Web Portal**: `http://localhost:3000`

### 3. Mobile Application
```bash
cd apps/mobile
npm install
npm start
```
- **Android**: `npm run android`
- **iOS**: `npm run ios`

---

## 🛠️ Build & Scripts Summary

| Application | Development | Production Build | Start Production |
| :--- | :--- | :--- | :--- |
| **Backend** | `npm run dev` | `npm run build` | `npm start` |
| **Frontend** | `npm run dev` | `npm run build` | `npm start` |
| **Mobile** | `npm start` | `eas build -p android` | `n/a` |

