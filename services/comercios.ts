import { api } from "./api";

export interface Comercio {
  id: string;
  nombre: string;
  codigo_unico: string;
}

export async function createComercio(nombre: string): Promise<Comercio> {
  const data = await api.post<Record<string, unknown>>("/comercios", { nombre });
  return data as any;
}
