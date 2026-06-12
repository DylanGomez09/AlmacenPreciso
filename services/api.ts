const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://almacenpreciso-backend-production.up.railway.app/api";

let authToken: string | null = null;
let authRefreshHandler: (() => Promise<boolean>) | null = null;

interface RequestConfig {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

const TIMEOUT_MS = 15000;

export function setAuthRefreshHandler(handler: () => Promise<boolean>) {
  authRefreshHandler = handler;
}

export function setStoredToken(token: string | null) {
  authToken = token;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (authToken && !config.skipAuth) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const execute = async (isRetry = false): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: config.method || "GET",
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 401 && authRefreshHandler && !config.skipAuth && !isRetry) {
        const refreshed = await authRefreshHandler();
        if (refreshed) {
          headers["Authorization"] = `Bearer ${authToken}`;
          return execute(true);
        }
        throw new Error("Sesión expirada");
      }

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
  };

  return execute();
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, config?: RequestConfig) => request<T>(endpoint, { ...config, method: "POST", body }),
  put: <T>(endpoint: string, body: unknown, config?: RequestConfig) => request<T>(endpoint, { ...config, method: "PUT", body }),
  patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) => request<T>(endpoint, { ...config, method: "PATCH", body }),
  delete: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: "DELETE" }),
};
