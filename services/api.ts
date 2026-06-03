import { Platform } from "react-native";

const DEFAULT_URL = Platform.select({
  android: "http://10.0.2.2:3000/api",
  default: "http://localhost:3000/api",
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

let authToken: string | null = null;

interface RequestConfig {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: config.method || "GET",
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = typeof body === "object" && body !== null
      ? (body?.message || JSON.stringify(body))
      : `Error ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export function setStoredToken(token: string | null) {
  authToken = token;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: "PUT", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
