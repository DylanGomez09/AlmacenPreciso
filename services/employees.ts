import { api } from "./api";

export interface Employee {
  id: number;
  name: string;
  position: string;
  initials: string;
  active: boolean;
}

export interface JoinRequest {
  id: number;
  employee_name: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
}

export interface UnionCode {
  codigo_unico: string;
}

export async function getActiveEmployees(): Promise<Employee[]> {
  return api.get<Employee[]>("/employees/active");
}

export async function getJoinRequests(): Promise<JoinRequest[]> {
  return api.get<JoinRequest[]>("/employees/requests");
}

export async function approveRequest(id: number): Promise<void> {
  return api.post("/employees/requests/action", { id, action: "approve" });
}

export async function rejectRequest(id: number): Promise<void> {
  return api.post("/employees/requests/action", { id, action: "reject" });
}

export async function getUnionCode(): Promise<UnionCode> {
  return api.get<UnionCode>("/employees/union-code");
}
