<p align="center">
  <img src="assets/images/icon.png" alt="AlmacenPreciso" width="120" height="120" />
</p>

<h1 align="center">AlmacenPreciso</h1>

<p align="center">
  <strong>Gestión de inventario y faltantes para almacenes</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.0-000020?logo=expo&logoColor=white" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/NativeWind-4.4-38BDF8?logo=tailwindcss&logoColor=white" alt="NativeWind 4" />
  <br/>
  <img src="https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white" alt="Android" />
  <img src="https://img.shields.io/badge/iOS-000000?logo=apple&logoColor=white" alt="iOS" />
  <img src="https://img.shields.io/badge/Web-4285F4?logo=googlechrome&logoColor=white" alt="Web" />
</p>

---

## ✨ Features

- **Reportar Faltantes** — Empleados reportan productos faltantes con nombre y categoría
- **Aprobar / Rechazar** — Dueños revisan y gestionan los reportes
- **Métricas en Tiempo Real** — Dashboard con conteo de faltantes y empleados activos
- **Código de Unión** — Compartí el código del almacén para que empleados se unan
- **Notificaciones Push** — Alertas cuando se reporta o aprueba un faltante
- **Roles** — Interfaz adaptada para Dueño y Empleado

## 📱 Screenshots

| Home (Dueño) | Home (Empleado) | Inventario | Empleados |
|---|---|---|---|
| `(coming soon)` | `(coming soon)` | `(coming soon)` | `(coming soon)` |

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/tu-usuario/almacenpreciso.git
cd almacenpreciso

# 2. Install
pnpm install

# 3. Start
pnpm start
```

> Requires Expo Go or a development build on your device.

## 🏗️ Project Architecture

```
app/                    # Expo Router screens
├── (auth)/             # Login & Register
├── (tabs)/             # Main tabbed interface
│   ├── index.tsx       # Home (dashboard)
│   ├── inventory.tsx   # Faltantes CRUD
│   ├── employees.tsx   # Team management
│   └── profile.tsx     # User settings
├── _layout.tsx         # Root layout
└── index.tsx           # Entry redirect

components/             # Reusable UI
├── faltante-card.tsx   # Faltante list card
├── employee-list-item.tsx  # Employee card
├── metric-card.tsx     # Stats card
└── toast.tsx           # Animated notifications

services/               # API layer
├── api.ts              # HTTP client
├── auth.ts             # Authentication
├── faltantes.ts        # Faltantes CRUD
├── employees.ts        # Employee list
├── comercios.ts        # Comercio API
└── notifications.ts    # Push notifications

context/                # State management
└── auth-context.tsx    # Auth state + token persistence
```

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/join` | Join almacén |
| GET | `/api/auth/me` | Current user |
| GET | `/api/usuarios` | List employees |
| POST | `/api/usuarios/push-token` | Register push token |
| GET | `/api/faltantes` | List faltantes |
| POST | `/api/faltantes` | Create faltante |
| PATCH | `/api/faltantes/:id/estado` | Approve/reject |
| DELETE | `/api/faltantes/:id` | Delete faltante |
| GET | `/api/comercios/me` | Union code |
| GET | `/api/faltantes/metricas` | Dashboard metrics |

> Backend hosted on Railway. URL configured via `EXPO_PUBLIC_API_URL` env var.

## 🛠️ Scripts

```bash
pnpm start         # Dev server (builds CSS first)
pnpm android       # Start for Android
pnpm ios           # Start for iOS
pnpm web           # Start for web
pnpm build:css     # Rebuild Tailwind CSS
pnpm lint          # ESLint
node scripts/generate-icons.js   # Regenerate app icons
```

## 📦 Building APK

```bash
pnpm build:css
eas build -p android --profile preview
```

> Requires an Expo account and EAS CLI (`pnpm add -g eas-cli`).

## 🤝 Roles

### Dueño
- Dashboard with metrics (faltantes hoy, empleados activos)
- Approve/reject faltante reports
- Manage employees (view list)
- Share union code

### Empleado
- Report new faltantes
- View pending reports
- View team members
- Join almacén via union code

## 🧩 Tech Stack

| Frontend | Backend (separate) |
|---|---|
| Expo SDK 54 | Railway |
| React Native 0.81 | Node.js / Express |
| NativeWind 4 (Tailwind) | Supabase (PostgreSQL) |
| TypeScript 5.9 | JWT auth |
| expo-router v6 | REST API |
| expo-notifications | Push notifications |

## 📄 License

MIT
