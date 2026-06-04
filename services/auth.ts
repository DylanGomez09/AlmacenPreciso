import { api, setStoredToken } from "./api";

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: "dueño" | "empleado";
  comercio_id?: string | null;
}

interface LoginResponse {
  token: string;
  usuario: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>("/auth/login", { email, password });
  setStoredToken(data.token);
  return data;
}

export function logout() {
  setStoredToken(null);
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
  const result = await api.post<LoginResponse>("/auth/register", data);
  setStoredToken(result.token);
  return result;
}
