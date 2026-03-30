# MentorX Mobile Architecture Guide

This project follows an industry-level, scalable architecture designed for maintenance and team growth.

## Directory Structure Overview

### 📁 `app/` (Expo Router)
The core of navigation. This directory uses file-based routing.
- **`(auth)/`**: Contains login, registration, and password recovery screens.
- **`(tabs)/`**: The main post-authentication user interface.
- **`_layout.tsx`**: Root layout that provides context (Auth, Theme) to the entire app.

### 📁 `components/`
UI building blocks following Atomic Design principles.
- **`common/`**: Reusable generic components (Button, Input, Card, Badge).
- **`features/`**: Complex components scoped to specific business logic (e.g., `MentorCard`, `SkillSelection`).
- **`navigation/`**: Custom Tab Bar, Header, and Drawer components.

### 📁 `context/`
Global state management using React Context.
- **`AuthContext.tsx`**: Handles authentication state, tokens, and user profile data.

### 📁 `services/`
The API layer. All communication with the BlockLearn backend happens here.
- **`api.ts`**: The base fetch/axios wrapper.
- **`authService.ts`**: Logic for login, signup, and OTP verification.
- **`mentorService.ts`**: Logic for fetching mentors and skill matching.

### 📁 `hooks/`
Shared custom React hooks to keep components dry and clean.
- **`useAuth.ts`**: Easy access to the authentication state.
- **`useNotification.ts`**: Handles push notifications and alerts.

### 📁 `utils/`
Pure helper functions that don't depend on React.
- **`validators.ts`**: Email/Password validation logic.
- **`dateFormatter.ts`**: Logic to format timestamps for the UI.

### 📁 `types/`
TypeScript definitions (interfaces/types) to ensure type safety across the project.

### 📁 `constants/`
Single source of truth for styles and configuration.
- **`theme.ts`**: Color palettes, font sizes, and spacing.
- **`Config.ts`**: API URLs and environment configuration.

---

## Best Practices Followed
1.  **Separated Concerns**: UI (components) is separate from logic (hooks) and data (services).
2.  **Type Safety**: Every data structure is defined in `types/`.
3.  **Global State**: Complex state is managed via Context, reducing prop-drilling.
4.  **Route Groups**: Screen categorization helps manage visibility and layout.
