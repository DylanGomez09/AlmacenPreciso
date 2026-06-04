import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/auth-context";
import { EmployeeListItem } from "@/components/employee-list-item";
import { getActiveEmployees, getUnionCode, type Employee } from "@/services/employees";
import { createComercio } from "@/services/comercios";
import * as SecureStore from "expo-secure-store";
import { api } from "@/services/api";

const isWeb = Platform.OS === "web";

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [unionCode, setUnionCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [sinComercio, setSinComercio] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [creando, setCreando] = useState(false);
  const [crearError, setCrearError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const empData = await getActiveEmployees().catch(() => [] as Employee[]);
        setEmployees(empData);
      } catch {}
      try {
        if (user?.rol === "dueño" && user?.comercio_id) {
          setSinComercio(false);
          setCodeError(false);
          const key = `union_code_${user.id}`;
          const cached = isWeb ? localStorage.getItem(key) : await SecureStore.getItemAsync(key);
          if (cached) {
            setUnionCode(cached);
          } else {
            const code = await getUnionCode();
            if (code) {
              if (isWeb) {
                localStorage.setItem(key, code);
              } else {
                await SecureStore.setItemAsync(key, code);
              }
              setUnionCode(code);
            } else {
              setCodeError(true);
            }
          }
        } else if (user?.rol === "dueño") {
          setSinComercio(true);
        }
      } catch {
        if (user?.rol === "dueño" && user?.comercio_id) {
          setCodeError(true);
        } else if (user?.rol === "dueño") {
          setSinComercio(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.rol, user?.comercio_id]);

  useFocusEffect(
    useCallback(() => {
      if (!isFirstLoad.current) {
        getActiveEmployees()
          .then(setEmployees)
          .catch(() => {});
        if (user?.rol === "dueño" && user?.comercio_id) {
          getUnionCode()
            .then((code) => { if (code) setUnionCode(code); })
            .catch(() => {});
        }
      }
      isFirstLoad.current = false;
    }, [user?.rol, user?.comercio_id])
  );

  function extractCodigoUnico(data: any): string {
    if (typeof data === "string") return data;
    if (data?.codigo_unico) return data.codigo_unico;
    if (data?.data?.codigo_unico) return data.data.codigo_unico;
    if (data?.comercio?.codigo_unico) return data.comercio.codigo_unico;
    return "";
  }

  async function handleCreateComercio() {
    if (!storeName) return;
    setCreando(true);
    setCrearError("");
    try {
      const comercio = await createComercio(storeName);
      const codigo = extractCodigoUnico(comercio);
      if (codigo) {
        const key = `union_code_${user?.id}`;
        if (isWeb) {
          localStorage.setItem(key, codigo);
        } else {
          await SecureStore.setItemAsync(key, codigo);
        }
        setUnionCode(codigo);
        setSinComercio(false);
      }
      await refreshUser();
      setStoreName("");
    } catch (e: any) {
      setCrearError(e.message || "Error al crear el almacén");
    } finally {
      setCreando(false);
    }
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
      await refreshUser();
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
          <Text className="text-3xl font-bold text-gray-900">Empleados</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {sinComercio ? (
            <View className="mx-5 bg-brand rounded-2xl p-5 mb-6">
              <Text className="text-white/80 text-sm font-medium mb-2">Crea tu Almacén</Text>
              <Text className="text-white/60 text-xs mb-3">Registra tu almacén para generar el código de unión</Text>
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-gray-900 mb-3"
                placeholder="Nombre del almacén"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={storeName}
                onChangeText={setStoreName}
              />
              {crearError && (
                <Text className="text-white/80 text-xs mb-2">{crearError}</Text>
              )}
              <TouchableOpacity
                onPress={handleCreateComercio}
                disabled={creando || !storeName}
                className="bg-white/20 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-bold text-base">
                  {creando ? "Creando..." : "Crear Almacén"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mx-5 bg-brand rounded-2xl p-5 mb-6">
              <Text className="text-white/80 text-sm font-medium mb-1">Código de Unión</Text>
              <View className="flex-row items-center justify-between">
                {codeError ? (
                  <Text className="text-white/80 text-base">Error al cargar el código</Text>
                ) : unionCode ? (
                  <Text className="text-3xl font-bold text-white tracking-widest">{unionCode}</Text>
                ) : (
                  <Text className="text-white/80 text-base">Generando código...</Text>
                )}
                <TouchableOpacity
                  className="bg-white/20 rounded-xl px-4 py-2"
                  onPress={() => Share.share({ message: `Código de unión: ${unionCode}` })}
                >
                  <Feather name="share-2" size={18} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-white/60 text-xs mt-2">Comparte este código con nuevos empleados</Text>
            </View>
          )}

          <View className="px-5 mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">Empleados Activos</Text>
            {employees.map((emp) => (
              <EmployeeListItem key={emp.id} {...emp} />
            ))}
            {employees.length === 0 && (
              <View className="items-center py-4">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                  <Feather name="users" size={16} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-2">No hay empleados registrados</Text>
                </View>
              </View>
            )}
          </View>


        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-gray-900">Mi Equipo</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {!user?.comercio_id && !joinSuccess && (
            <View className="bg-brand rounded-2xl p-5 mb-6">
              <Text className="text-white/80 text-sm font-medium mb-2">Únete a un equipo</Text>
              <Text className="text-white/60 text-xs mb-3">Ingresa el código que te compartió el dueño</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-3">
                <Text className="text-base font-bold text-brand mr-1">AP-</Text>
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="1234"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={joinCode.replace("AP-", "")}
                  onChangeText={(text) => {
                    const digits = text.replace(/\D/g, "");
                    setJoinCode(digits ? `AP-${digits}` : "");
                  }}
                />
              </View>
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

          <Text className="text-xl font-bold text-gray-900 mb-3">Compañeros</Text>
          {employees.map((emp) => (
            <EmployeeListItem key={emp.id} {...emp} />
          ))}
          {employees.length === 0 && (
            <View className="items-center py-4">
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <Feather name="users" size={16} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-2">No hay compañeros registrados</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
