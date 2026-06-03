import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, logout as apiLogout, type User } from "@/services/auth";

const STORAGE_KEY = "auth_user";
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await storageGet(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.nombre && parsed.rol) {
            setUser(parsed);
          } else {
            await storageDelete(STORAGE_KEY);
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
    setUser(data.usuario);
    await storageSet(STORAGE_KEY, JSON.stringify(data.usuario));
  }

  async function logout() {
    apiLogout();
    setUser(null);
    await storageDelete(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
