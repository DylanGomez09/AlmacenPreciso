# AlmacenPreciso — App Context

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 |
| UI | React Native 0.81 + NativeWind 4 (Tailwind CSS) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript 5.9 |
| Icons | `@expo/vector-icons` (Feather) |
| Auth | JWT stored in `expo-secure-store` |
| Push | `expo-notifications` + `expo-device` |
| Animations | `react-native-reanimated` + built-in `Animated` |
| Backend | Node.js deployed on Railway |

## Project Structure

```
almacenpreciso/
├── app/
│   ├── _layout.tsx          # Root layout (StatusBar)
│   ├── index.tsx            # Entry redirect
│   ├── (auth)/
│   │   ├── _layout.tsx      # Auth stack navigator
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar (animated pill indicator)
│       ├── index.tsx        # Home (metrics + faltantes + approve/delete)
│       ├── inventory.tsx    # Faltantes list + report modal
│       ├── employees.tsx    # Employee list + join code
│       └── profile.tsx      # Profile info + logout
├── components/
│   ├── faltante-card.tsx    # Card for a faltante item
│   ├── employee-list-item.tsx  # Card for an employee
│   ├── metric-card.tsx      # Metric stat card
│   └── toast.tsx            # Animated toast notification
├── context/
│   └── auth-context.tsx     # Auth state, login/logout, token persistence
├── services/
│   ├── api.ts               # Base HTTP client (fetch + AbortController + auth header)
│   ├── auth.ts              # login(), register(), getMe()
│   ├── faltantes.ts         # CRUD for faltantes + metrics + field mapping
│   ├── employees.ts         # getActiveEmployees(), getUnionCode()
│   ├── comercios.ts         # Comercio API
│   └── notifications.ts     # Push notification registration (dynamic import)
├── scripts/
│   └── generate-icons.js    # Logo generator
├── docs/
│   └── APP_CONTEXT.md       # This file
└── assets/images/           # App icons (generated)
```

## Auth Flow

1. User logs in → JWT token saved to SecureStore (`auth_token`)
2. On app start, token restored from SecureStore → `getMe()` called to validate
3. `auth-context.tsx` exposes `{ user, login, logout, loading }`
4. `user.rol` is `"dueño"` or `"empleado"` — drives UI differences
5. Push token registered after login and on session restore

## API Mapping (Backend → Frontend)

| Endpoint | Method | Service | Notes |
|---|---|---|---|
| `/api/auth/login` | POST | `auth.ts` | Returns JWT |
| `/api/auth/register` | POST | `auth.ts` | Creates user |
| `/api/auth/me` | GET | `auth.ts` | Validates token |
| `/api/auth/join` | POST | `auth.ts` | Join with union code |
| `/api/usuarios` | GET | `employees.ts` | List employees |
| `/api/usuarios/push-token` | POST | `notifications.ts` | Register push token |
| `/api/faltantes` | GET | `faltantes.ts` | List (with field mapping) |
| `/api/faltantes` | POST | `faltantes.ts` | Create faltante |
| `/api/faltantes/:id/estado` | PATCH | `faltantes.ts` | Approve (estado="aprobado") |
| `/api/faltantes/:id` | DELETE | `faltantes.ts` | Delete |
| `/api/comercios/me` | GET | `employees.ts` | Get union code |
| `/api/faltantes/metricas` | GET | `faltantes.ts` | Metrics (counts) |

### Field Mapping

Backend `{ nombre, categoria, actualizado_por, estado }` → Frontend `{ name, category, reporter, urgent }`

## Key Decisions

- **No join requests UI**: removed because backend uses direct join via `/api/auth/join`
- **Employee list simplified**: removed `position`, `initials`, `active` fields — not in Supabase schema
- **Tab bar in `_layout.tsx`**, not `components/tab-bar.tsx` (dead code removed)
- **expo-notifications only works in APK** (not Expo Go) — guarded with dynamic imports + `executionEnvironment` check
- **API_BASE_URL** falls back to Railway production URL if no env var set
- **15s timeout** on all API calls via AbortController
- **Toast component** replaces native `Alert.alert()` for consistent styling

## Build & Deploy

```bash
# Development
pnpm start

# Build native (APK)
pnpm build:css && eas build -p android --profile preview

# Generate fresh icons
node scripts/generate-icons.js
```

## Union Code Format

`AP-XXXX` — displayed on Employees screen, shareable via `Share.share()`
