<p align="center">
  <img src="assets/images/icon.png" alt="AlmacenPreciso" width="120" height="120" />
</p>

<h1 align="center">AlmacenPreciso</h1>

<p align="center">
  <strong>Gestión inteligente de inventario y faltantes en tiempo real para almacenes y comercios.</strong>
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

## 📝 Descripción

**AlmacenPreciso** es una solución móvil diseñada para optimizar y agilizar la comunicación operativa entre los dueños de comercios y su personal. Resuelve el problema cotidiano de quiebres de stock y falta de productos en góndola, permitiendo que los empleados reporten faltantes de manera instantánea desde sus dispositivos.

A través de un flujo de trabajo simplificado basado en roles, los administradores reciben métricas en tiempo real, alertas mediante notificaciones push y la facultad de aprobar o rechazar reposiciones con un solo toque, centralizando la gestión de inventario y evitando pérdidas de ventas por falta de stock.

---

## 🔗 Repositorios del Proyecto

Esta aplicación corresponde al cliente móvil de la plataforma. Para consultar el código fuente de la API REST, migraciones de base de datos y la configuración del servidor, visitá:

👉 **[AlmacenPreciso - Backend Repository](https://github.com/DylanGomez09/AlmacenPreciso---Backend)**

---

## ✨ Features

- **Reportar Faltantes** — Empleados reportan productos faltantes especificando nombre, categoría y detalles
- **Aprobar / Rechazar** — Los dueños o administradores revisan y gestionan las solicitudes en tiempo real
- **Métricas e Indicadores** — Dashboard intuitivo con el conteo diario de faltantes y personal activo
- **Código de Unión** — Sistema ágil para vincular empleados al almacén mediante un código único
- **Notificaciones Push Instantáneas** — Alertas automáticas al reportar, aprobar o rechazar un faltante
- **Roles Personalizados** — Interfaz adaptativa que ajusta sus funcionalidades para Dueño y Empleado

---

## 📱 Screenshots

| Home (Dueño) | Home (Empleado) | Inventario | Empleados |
|---|---|---|---|
| `(coming soon)` | `(coming soon)` | `(coming soon)` | `(coming soon)` |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/DylanGomez09/AlmacenPreciso.git
cd almacenpreciso

# 2. Install
pnpm install

# 3. Start
pnpm start
```

> Requiere Expo Go o una build de desarrollo configurada en tu dispositivo.

---

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
├── faltante-card.tsx       # Faltante list card
├── employee-list-item.tsx  # Employee card
├── metric-card.tsx         # Stats card
└── toast.tsx                # Animated notifications

services/               # API layer
├── api.ts               # HTTP client
├── auth.ts              # Authentication
├── faltantes.ts         # Faltantes CRUD
├── employees.ts         # Employee list
├── comercios.ts         # Comercio API
└── notifications.ts     # Push notifications

context/                # State management
└── auth-context.tsx    # Auth state + token persistence
```

---

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

> Backend desplegado en Railway. La URL base se configura mediante la variable de entorno `EXPO_PUBLIC_API_URL`.

---

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

---

## 📦 Building APK

```bash
pnpm build:css
eas build -p android --profile preview
```

> Requiere una cuenta de Expo y el CLI de EAS configurado (`pnpm add -g eas-cli`).

---

## 🤝 Roles

### Dueño

- Dashboard dinámico con métricas clave (faltantes del día, empleados activos)
- Aprobación y rechazo de reportes de faltantes
- Gestión del personal y visualización del equipo
- Generación y compartido del código de unión

### Empleado

- Reporte rápido de nuevos faltantes
- Visualización y seguimiento del estado de reportes pendientes
- Acceso a la lista del equipo de trabajo
- Vinculación a comercios mediante el código de unión

---

## 🧩 Tech Stack

| Frontend (Mobile) | Backend (Separado) |
|---|---|
| Expo SDK 54 | Node.js / Express |
| React Native 0.81 | Supabase (PostgreSQL) |
| NativeWind 4 (Tailwind) | JWT Auth |
| TypeScript 5.9 | Deploy en Railway |
| expo-router v6 | REST API |
| expo-notifications | Push notifications |

---

## 📄 License

MIT
