import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { EmployeeListItem } from "@/components/employee-list-item";
import { getActiveEmployees, getJoinRequests, getUnionCode, approveRequest, rejectRequest, type Employee, type JoinRequest } from "@/services/employees";
import { api } from "@/services/api";

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [unionCode, setUnionCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [empData, reqData] = await Promise.all([
          getActiveEmployees(),
          getJoinRequests(),
        ]);
        setEmployees(empData);
        setRequests(reqData.filter((r) => r.status === "pending"));
        if (user?.rol === "dueño") {
          const codeData = await getUnionCode();
          setUnionCode(codeData.codigo_unico);
        }
      } catch {
        setCodeError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.rol]);

  async function handleReject(id: number) {
    try {
      await rejectRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  }

  async function handleApprove(id: number) {
    try {
      await approveRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  }

  async function handleJoin() {
    if (!joinCode) return;
    setJoinLoading(true);
    setJoinError("");
    setJoinSuccess(false);
    try {
      await api.post("/auth/join", { codigo_unico: joinCode });
      setJoinSuccess(true);
      setJoinCode("");
      const [empData] = await Promise.all([getActiveEmployees()]);
      setEmployees(empData);
    } catch (e: any) {
      setJoinError(e.message || "Código inválido");
    } finally {
      setJoinLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center" style={{ paddingTop: insets.top + 8 }}>
        <ActivityIndicator size="large" color="#00875A" />
      </View>
    );
  }

  if (user?.rol === "dueño") {
    return (
      <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Empleados</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mx-5 bg-brand rounded-2xl p-5 mb-6">
            <Text className="text-white/80 text-sm font-medium mb-1">Código de Unión</Text>
            <View className="flex-row items-center justify-between">
              {codeError ? (
                <Text className="text-white/80 text-base">Error al cargar el código</Text>
              ) : (
                <Text className="text-3xl font-bold text-white tracking-widest">{unionCode}</Text>
              )}
              <TouchableOpacity className="bg-white/20 rounded-xl px-4 py-2">
                <Feather name="copy" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-white/60 text-xs mt-2">Comparte este código con nuevos empleados</Text>
          </View>

          <View className="px-5 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Empleados Activos</Text>
            {employees.map((emp) => (
              <EmployeeListItem key={emp.id} {...emp} />
            ))}
            {employees.length === 0 && (
              <View className="items-center py-10">
                <Feather name="users" size={48} color="#D1D5DB" />
                <Text className="text-muted text-base mt-3">No hay empleados registrados</Text>
              </View>
            )}
          </View>

          {requests.length > 0 && (
            <View className="px-5 pb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-lg font-bold text-gray-900">Solicitudes Pendientes</Text>
                <View className="bg-coral-bg rounded-full px-2 py-0.5">
                  <Text className="text-xs font-bold text-coral">{requests.length}</Text>
                </View>
              </View>
              {requests.map((req) => (
                <View
                  key={req.id}
                  className="bg-white rounded-2xl p-4 mb-2 border border-gray-100 shadow-sm"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-brand-light items-center justify-center mr-3">
                        <Text className="text-brand font-bold text-sm">
                          {req.employee_name.split(" ").map((s) => s[0]).join("")}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-base font-semibold text-gray-900">{req.employee_name}</Text>
                        <Text className="text-sm text-muted">Solicita unirse al equipo</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity
                      onPress={() => handleReject(req.id)}
                      className="flex-1 py-2.5 rounded-xl border border-danger items-center"
                    >
                      <Text className="text-danger font-semibold text-sm">Rechazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleApprove(req.id)}
                      className="flex-1 py-2.5 rounded-xl bg-brand items-center"
                    >
                      <Text className="text-white font-semibold text-sm">Aprobar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Mi Equipo</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {!user?.comercio_id && !joinSuccess && (
            <View className="bg-brand rounded-2xl p-5 mb-6">
              <Text className="text-white/80 text-sm font-medium mb-2">Únete a un equipo</Text>
              <Text className="text-white/60 text-xs mb-3">Ingresa el código que te compartió el dueño</Text>
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-gray-900 mb-3"
                placeholder="Código de unión"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={joinCode}
                onChangeText={setJoinCode}
              />
              {joinError && (
                <Text className="text-white/80 text-xs mb-2">{joinError}</Text>
              )}
              <TouchableOpacity
                onPress={handleJoin}
                disabled={joinLoading || !joinCode}
                className="bg-white/20 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-bold text-base">
                  {joinLoading ? "Uniendo..." : "Unirse"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {joinSuccess && (
            <View className="bg-brand rounded-2xl p-5 mb-6 items-center">
              <Feather name="check-circle" size={32} color="white" />
              <Text className="text-white font-bold text-base mt-2">Te has unido al equipo</Text>
            </View>
          )}

          <Text className="text-lg font-bold text-gray-900 mb-3">Compañeros</Text>
          {employees.map((emp) => (
            <EmployeeListItem key={emp.id} {...emp} />
          ))}
          {employees.length === 0 && (
            <View className="items-center py-10">
              <Feather name="users" size={48} color="#D1D5DB" />
              <Text className="text-muted text-base mt-3">No hay compañeros registrados</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
