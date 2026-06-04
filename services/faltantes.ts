import { api } from "./api";

export interface Faltante {
  id: number;
  name: string;
  category: string;
  reporter: string;
  urgent: boolean;
  created_at: string;
}

export interface Metrics {
  faltantes_hoy: number;
  empleados_activos: number;
}

export async function getMetrics(): Promise<Metrics> {
  return api.get<Metrics>("/dashboard/metrics");
}

export async function getFaltantes(): Promise<Faltante[]> {
  const data = await api.get<unknown>("/faltantes");
  const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
  return (list as any[]).map((item) => ({
    id: item.id as number,
    name: item.nombre as string,
    category: (item.categoria as string) || "General",
    reporter: (item.actualizado_por as string) || "",
    urgent: item.estado === "urgente",
    created_at: item.created_at as string,
  }));
}

export async function approveFaltante(id: number): Promise<void> {
  return api.patch(`/faltantes/${id}/estado`, { estado: "aprobado" });
}

export async function deleteFaltante(id: number): Promise<void> {
  return api.delete(`/faltantes/${id}`);
}

export interface ReportFaltanteData {
  nombre: string;
  categoria: string;
}

export async function reportFaltante(data: ReportFaltanteData): Promise<void> {
  return api.post("/faltantes", data);
}
