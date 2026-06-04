const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://almacenpreciso-backend-production.up.railway.app/api";

let authToken: string | null = null;

interface RequestConfig {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const TIMEOUT_MS = 15000;

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: config.method || "GET",
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = typeof body === "object" && body !== null
        ? (body?.message || JSON.stringify(body))
        : `Error ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Network timeout — No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que EXPO_PUBLIC_API_URL sea correcta.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export function setStoredToken(token: string | null) {
  authToken = token;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: "PUT", body }),
  patch: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: "PATCH", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
