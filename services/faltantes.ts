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
  return api.get<Faltante[]>("/faltantes");
}

export async function approveFaltante(id: number): Promise<void> {
  return api.post("/faltantes/action", { id, action: "approve" });
}

export async function deleteFaltante(id: number): Promise<void> {
  return api.post("/faltantes/action", { id, action: "delete" });
}

export interface ReportFaltanteData {
  nombre: string;
  categoria: string;
}

export async function reportFaltante(data: ReportFaltanteData): Promise<void> {
  return api.post("/inventory/report", data);
}
