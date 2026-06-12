import { api } from "./api";

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: "dueño" | "empleado";
  comercio_id?: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: User;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>("/auth/login", { email, password });
}

export async function logout() {
  await api.post("/auth/logout", {}).catch(() => {});
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  return api.post<RefreshResponse>("/auth/refresh", { refresh_token: refreshToken }, { skipAuth: true });
}

export async function getMe(): Promise<User> {
  const data = await api.get<{ usuario: User }>("/auth/me");
  return data.usuario;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: "dueño" | "empleado";
  codigo_unico?: string;
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  return api.post<LoginResponse>("/auth/register", data);
}
