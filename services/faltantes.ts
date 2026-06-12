import { api } from "./api";
import { storageGet, storageSet, storageDelete } from "./storage";

const CACHE_KEY = "faltantes_cache";

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

function mapFaltante(item: any): Faltante {
  return {
    id: item.id as number,
    name: item.nombre as string,
    category: (item.categoria as string) || "General",
    reporter: (item.actualizado_por as string) || "",
    urgent: item.estado === "urgente",
    created_at: item.created_at as string,
  };
}

export async function getCachedFaltantes(): Promise<Faltante[] | null> {
  try {
    const raw = await storageGet(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw) as Faltante[];
    }
  } catch {}
  return null;
}

async function saveCache(faltantes: Faltante[]) {
  await storageSet(CACHE_KEY, JSON.stringify(faltantes));
}

export async function getMetrics(): Promise<Metrics> {
  return api.get<Metrics>("/dashboard/metrics");
}

export async function getFaltantes(): Promise<Faltante[]> {
  const data = await api.get<unknown>("/faltantes");
  const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
  const mapped = (list as any[]).map(mapFaltante);
  await saveCache(mapped);
  return mapped;
}

export async function approveFaltante(id: number): Promise<void> {
  await api.patch(`/faltantes/${id}/estado`, { estado: "aprobado" });
  const cached = await getCachedFaltantes();
  if (cached) {
    await saveCache(cached.filter((f) => f.id !== id));
  }
}

export async function deleteFaltante(id: number): Promise<void> {
  await api.delete(`/faltantes/${id}`);
  const cached = await getCachedFaltantes();
  if (cached) {
    await saveCache(cached.filter((f) => f.id !== id));
  }
}

export interface ReportFaltanteData {
  nombre: string;
  categoria: string;
}

export async function reportFaltante(data: ReportFaltanteData): Promise<void> {
  await api.post("/faltantes", data);
  await storageDelete(CACHE_KEY);
}

export async function clearFaltantesCache() {
  await storageDelete(CACHE_KEY);
}
