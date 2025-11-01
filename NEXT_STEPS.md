# FridayOS - Næste Skridt til Cursor Udvikling

**Repository:** https://github.com/TekupDK/fridayos-mobile  
**Dato:** 1. november 2025  
**Status:** Fase 1-4 Komplet, Klar til Fase 5

---

## 🎯 Hurtig Start

Velkommen til FridayOS-projektet! Dette dokument guider dig gennem de næste skridt for at fortsætte udviklingen i Cursor.

### 1. Klon Repository

```bash
git clone https://github.com/TekupDK/fridayos-mobile.git
cd fridayos-mobile
```

### 2. Installer Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm start
```

### 4. Kør på Simulator/Emulator

```bash
# iOS (kræver macOS)
pnpm run ios

# Android
pnpm run android

# Web (for test)
pnpm run web
```

---

## 📋 Hvad er Allerede Bygget?

### ✅ Komplet Projektstruktur

Projektet er sat op med en moderne React Native + Expo stack:

- **Navigation:** Expo Router med fil-baseret routing
- **State Management:** Zustand (UI state) + TanStack React Query (server state)
- **API Client:** Axios med automatisk JWT token-håndtering
- **TypeScript:** Strict mode med path aliases

### ✅ Skærme (Placeholders)

Alle hovedskærme er oprettet som placeholders:

- `app/index.tsx` - Splash/Auth check
- `app/login.tsx` - Login skærm (Google OAuth placeholder)
- `app/(tabs)/inbox.tsx` - Indbakke med Primary/Todos faner
- `app/(tabs)/ai.tsx` - AI Assistant chat
- `app/(tabs)/compose.tsx` - Email komposition
- `app/(tabs)/search.tsx` - Email søgning

### ✅ Services og Configuration

- `src/services/api.ts` - Axios instance med JWT interceptors
- `src/stores/appStore.ts` - Global app state (Zustand)
- `src/config/env.ts` - Environment variabler
- `src/config/queryClient.ts` - React Query setup

---

## 🚀 Fase 5: tRPC-integration (NÆSTE)

**Mål:** Etabler type-sikker kommunikation mellem mobilappen og NestJS-backend.

### Step 1: Installer tRPC Dependencies

```bash
pnpm add @trpc/client @trpc/react-query @trpc/server
```

### Step 2: Opret tRPC Client

Opret `src/services/trpc.ts`:

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@tekup/backend'; // Import fra din NestJS backend

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.EXPO_PUBLIC_API_BASE_URL + '/trpc',
      headers() {
        // JWT token vil blive tilføjet automatisk af Axios interceptor
        return {};
      },
    }),
  ],
});
```

### Step 3: Definer Data Models

Opret `src/types/email.ts`:

```typescript
export interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: Array<{
    name: string;
    email: string;
  }>;
  subject: string;
  snippet: string;
  body: string;
  date: Date;
  labels: string[];
  isRead: boolean;
  hasAttachments: boolean;
  attachments?: Attachment[];
}

export interface Thread {
  id: string;
  subject: string;
  participants: string[];
  messageCount: number;
  lastMessageDate: Date;
  snippet: string;
  labels: string[];
  isRead: boolean;
}

export interface Label {
  id: string;
  name: string;
  type: 'system' | 'user';
  color?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}
```

### Step 4: Integrer tRPC i Root Layout

Opdater `app/_layout.tsx`:

```typescript
import { trpc, trpcClient } from '@/services/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Resten af din app */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Step 5: Test Forbindelsen

I `app/(tabs)/inbox.tsx`, test tRPC-forbindelsen:

```typescript
import { trpc } from '@/services/trpc';

export default function InboxScreen() {
  const { data, isLoading } = trpc.email.list.useQuery({
    maxResults: 50,
    labelIds: ['INBOX'],
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={data?.emails}
      renderItem={({ item }) => <EmailListItem email={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## 🔐 Fase 6: Google Login og Autentificering

**Mål:** Implementer et sikkert login-flow med Google OAuth.

### Step 1: Backend OAuth Endpoint

Sørg for, at din NestJS-backend har et `/auth/google`-endpoint, der:
1. Håndterer Google OAuth-flowet
2. Returnerer et JWT-token ved succesfuld login

### Step 2: Installer Expo Auth Session

```bash
pnpm add expo-auth-session expo-web-browser
```

### Step 3: Implementer Login i Mobilappen

Opdater `app/login.tsx`:

```typescript
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'fridayos',
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      // Send code til din backend for at få JWT token
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    const response = await fetch(
      process.env.EXPO_PUBLIC_API_BASE_URL + '/auth/google',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }
    );
    const { accessToken } = await response.json();
    await SecureStore.setItemAsync('accessToken', accessToken);
    router.replace('/(tabs)/inbox');
  };

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
```

---

## 📧 Fase 7: Kernefunktionalitet

### Inbox Screen

Implementer email-liste med threading:

```typescript
export default function InboxScreen() {
  const { activeTab, setActiveTab } = useAppStore();
  const { data: emails, isLoading, refetch } = trpc.email.list.useQuery({
    labelIds: activeTab === 'primary' ? ['INBOX', 'CATEGORY_PRIMARY'] : ['STARRED'],
  });

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('primary')}>
          <Text>Primary</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('todos')}>
          <Text>Todos</Text>
        </TouchableOpacity>
      </View>

      {/* Email List */}
      <FlatList
        data={emails}
        renderItem={({ item }) => <EmailListItem email={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </View>
  );
}
```

### AI Assistant Screen

Implementer chat med streaming:

```typescript
export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const askAI = trpc.ai.ask.useMutation();

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await askAI.mutateAsync({ prompt: input });
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}
```

---

## 📚 Vigtige Dokumenter

Alle disse dokumenter er inkluderet i projektet:

- **[README.md](./README.md)** - Projekt overview og installation
- **[FridayOS_Development_Guide.md](/home/ubuntu/FridayOS_Development_Guide.md)** - Omfattende udviklingsguide
- **[FridayOS_Analysis_Report.md](/home/ubuntu/FridayOS_Analysis_Report.md)** - 66-siders analyse af TekupDK-økosystemet
- **[FridayOS_Architecture_And_Dataflow.md](/home/ubuntu/FridayOS_Architecture_And_Dataflow.md)** - Detaljeret arkitektur
- **[FridayOS_Project_Status.md](/home/ubuntu/FridayOS_Project_Status.md)** - Status rapport

---

## 🔗 Nyttige Links

- **GitHub Repository:** https://github.com/TekupDK/fridayos-mobile
- **Expo Documentation:** https://docs.expo.dev/
- **tRPC Documentation:** https://trpc.io/docs
- **React Query Documentation:** https://tanstack.com/query/latest
- **Zustand Documentation:** https://zustand-demo.pmnd.rs/

---

## 💡 Tips til Cursor Udvikling

1. **Brug AI til Boilerplate:** Lad Cursor generere genbrugelige komponenter som `EmailListItem`, `ChatMessage`, etc.
2. **Type Safety:** Sørg for at importere types fra din NestJS-backend for fuld type-sikkerhed.
3. **Test Løbende:** Kør appen på en simulator/emulator løbende for at se dine ændringer i real-time.
4. **Følg Expo Best Practices:** Brug Expo's anbefalede patterns for navigation, styling og state management.

---

**Held og lykke med udviklingen! 🚀**
