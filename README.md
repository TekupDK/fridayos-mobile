# FridayOS Mobile

**Version:** 1.0.0  
**Platform:** iOS & Android  
**Framework:** React Native + Expo

## Oversigt

FridayOS er en intelligent email-assistent mobilapplikation til Rendetalje, designet til at levere en Shortwave-inspireret oplevelse på både iOS og Android. Appen integrerer dybt med Tekup-økosystemet og udnytter Google APIs via MCP-servere samt avancerede AI-modeller.

## Teknisk Stack

- **Frontend:** React Native 0.81 + Expo 54
- **Navigation:** Expo Router (filbaseret routing)
- **State Management:** Zustand (UI state) + TanStack React Query (server state)
- **API Client:** Axios med JWT interceptors
- **Offline Storage:** Expo SQLite + AsyncStorage + Secure Store
- **Backend:** NestJS (eksisterende Tekup API)
- **Database:** Supabase PostgreSQL + Redis
- **AI Integration:** GPT-4o, Gemini, Claude (via backend)

## Projektstruktur

```
fridayos-mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-baserede skærme
│   │   ├── inbox.tsx      # Indbakke med Primary/Todos faner
│   │   ├── ai.tsx         # AI Assistant chat
│   │   ├── compose.tsx    # Email komposition
│   │   └── search.tsx     # Email søgning
│   ├── _layout.tsx        # Root layout med providers
│   ├── index.tsx          # Splash/Auth check
│   └── login.tsx          # Login skærm
├── src/
│   ├── components/        # Genbrugelige UI komponenter
│   ├── screens/           # Komplekse skærme (hvis nødvendigt)
│   ├── services/          # API clients og eksterne services
│   │   └── api.ts         # Axios instance med interceptors
│   ├── stores/            # Zustand stores
│   │   └── appStore.ts    # Global app state
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper funktioner
│   └── config/            # Konfigurationsfiler
│       ├── env.ts         # Environment variabler
│       └── queryClient.ts # React Query setup
├── assets/                # Billeder, ikoner, fonts
├── app.json              # Expo konfiguration
├── tsconfig.json         # TypeScript konfiguration
└── package.json          # Dependencies

```

## Installation

### Forudsætninger

- Node.js 18+
- pnpm (anbefalet) eller npm
- Expo CLI (`pnpm add -g expo-cli`)
- iOS Simulator (macOS) eller Android Emulator

### Opsætning

1. **Installer dependencies:**
   ```bash
   cd /home/ubuntu/tekup/apps/fridayos-mobile
   pnpm install
   ```

2. **Konfigurer environment variabler:**
   Opret en `.env` fil i roden af projektet (eller brug Tekup-secrets):
   ```
   EXPO_PUBLIC_API_BASE_URL=https://api.tekup.dk
   EXPO_PUBLIC_WS_URL=wss://api.tekup.dk
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

3. **Start development server:**
   ```bash
   pnpm start
   ```

4. **Kør på simulator/emulator:**
   - iOS: `pnpm run ios` (kræver macOS)
   - Android: `pnpm run android`
   - Web (for test): `pnpm run web`

## Funktioner

### Fase 1 (Nuværende)
- ✅ Grundlæggende projektstruktur
- ✅ Expo Router navigation
- ✅ Zustand state management
- ✅ React Query setup
- ✅ Axios API client med JWT interceptors
- ✅ Placeholder skærme (Inbox, AI, Compose, Search, Login)

### Fase 2 (Næste)
- ⏳ Google OAuth 2.0 integration
- ⏳ Gmail API integration via MCP
- ⏳ Email liste visning
- ⏳ AI chat funktionalitet
- ⏳ Email komposition med AI-assistance

### Fase 3 (Fremtid)
- ⏳ Offline mode med SQLite caching
- ⏳ Biometric authentication
- ⏳ Push notifications
- ⏳ Advanced search med semantisk søgning

## Udvikling

### Kode Konventioner

- **TypeScript:** Strict mode aktiveret
- **Imports:** Brug path aliases (`@components/`, `@services/`, etc.)
- **Styling:** StyleSheet fra React Native (ingen inline styles)
- **State:** Zustand for UI, React Query for server data

### Testing

```bash
# Kør tests (når implementeret)
pnpm test

# Type check
pnpm tsc --noEmit
```

## Deployment

### iOS (App Store)

1. Konfigurer bundle identifier i `app.json`
2. Byg produktions-version: `eas build --platform ios`
3. Upload til App Store Connect

### Android (Google Play)

1. Konfigurer package name i `app.json`
2. Byg produktions-version: `eas build --platform android`
3. Upload til Google Play Console

## Support

For spørgsmål eller problemer, kontakt Tekup-teamet eller opret en issue i TekupDK/tekup repository.

---

**Udviklet af:** Manus AI  
**Dato:** 1. november 2025
