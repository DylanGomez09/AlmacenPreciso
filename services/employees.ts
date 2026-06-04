import { api } from "./api";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function getUnionCode(): Promise<string> {
  const data = await api.get<Record<string, unknown>>("/comercios/me");
  const obj = data as Record<string, unknown>;
  if (typeof obj.codigo_unico === "string") return obj.codigo_unico;
  const inner = (obj.comercio || obj.data || obj) as Record<string, unknown>;
  if (typeof inner.codigo_unico === "string") return inner.codigo_unico;
  return "";
}

export async function getActiveEmployees(): Promise<Employee[]> {
  const data = await api.get<unknown>("/usuarios");
  const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
  return (list as any[]).map((item) => ({
    id: item.id as number,
    name: item.nombre as string,
    email: item.email as string,
    role: item.rol as string,
  }));
}
