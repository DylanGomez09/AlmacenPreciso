import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { login as apiLogin, logout as apiLogout, getMe, refreshAccessToken, type User } from "@/services/auth";
import { setStoredToken, setAuthRefreshHandler } from "@/services/api";
import { registerForPushNotifications } from "@/services/notifications";

const STORAGE_KEY = "auth_user";
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const isWeb = Platform.OS === "web";

async function storageSet(key: string, value: string) {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {}
}

async function storageGet(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function storageDelete(key: string) {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function forceLogout() {
    setUser(null);
    setStoredToken(null);
    await storageDelete(TOKEN_KEY);
    await storageDelete(REFRESH_TOKEN_KEY);
    await storageDelete(STORAGE_KEY);
  }

  useEffect(() => {
    setAuthRefreshHandler(async () => {
      const refreshToken = await storageGet(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        await forceLogout();
        router.replace("/(auth)/login");
        return false;
      }
      try {
        const data = await refreshAccessToken(refreshToken);
        setStoredToken(data.access_token);
        await storageSet(TOKEN_KEY, data.access_token);
        await storageSet(REFRESH_TOKEN_KEY, data.refresh_token);
        return true;
      } catch {
        await forceLogout();
        router.replace("/(auth)/login");
        return false;
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [token, refreshToken] = await Promise.all([
          storageGet(TOKEN_KEY),
          storageGet(REFRESH_TOKEN_KEY),
        ]);

        if (token) {
          setStoredToken(token);
        }

        if (token && refreshToken) {
          try {
            const fresh = await getMe();
            setUser(fresh);
            await storageSet(STORAGE_KEY, JSON.stringify(fresh));
            registerForPushNotifications().catch(() => {});
          } catch {
            try {
              const data = await refreshAccessToken(refreshToken);
              setStoredToken(data.access_token);
              await storageSet(TOKEN_KEY, data.access_token);
              await storageSet(REFRESH_TOKEN_KEY, data.refresh_token);
              const fresh = await getMe();
              setUser(fresh);
              await storageSet(STORAGE_KEY, JSON.stringify(fresh));
              registerForPushNotifications().catch(() => {});
            } catch {
              await forceLogout();
            }
          }
        } else {
          const stored = await storageGet(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.nombre && parsed.rol) {
              setUser(parsed);
              registerForPushNotifications().catch(() => {});
            } else {
              await storageDelete(STORAGE_KEY);
            }
          }
        }
      } catch {
        await storageDelete(STORAGE_KEY);
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiLogin(email, password);
    setStoredToken(data.access_token);
    setUser(data.usuario);
    await storageSet(TOKEN_KEY, data.access_token);
    await storageSet(REFRESH_TOKEN_KEY, data.refresh_token);
    await storageSet(STORAGE_KEY, JSON.stringify(data.usuario));
    registerForPushNotifications().catch(() => {});
  }

  async function logout() {
    apiLogout().catch(() => {});
    await forceLogout();
    router.replace("/(auth)/login");
  }

  async function refreshUser() {
    try {
      const fresh = await getMe();
      setUser(fresh);
      await storageSet(STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
