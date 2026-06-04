import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { MetricCard } from "@/components/metric-card";
import { FaltanteCard } from "@/components/faltante-card";
import { Toast } from "@/components/toast";
import { getFaltantes, getMetrics, approveFaltante, deleteFaltante, type Faltante, type Metrics } from "@/services/faltantes";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [faltantes, setFaltantes] = useState<Faltante[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
  function showToast(message: string, type: "success" | "error" = "success") { setToast({ visible: true, message, type }); }

  const loadData = useCallback(async () => {
    try {
      const [faltantesData, metricsData] = await Promise.all([
        getFaltantes(),
        getMetrics(),
      ]);
      setFaltantes(faltantesData);
      setMetrics(metricsData);
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      await loadData();
      setLoading(false);
      isFirstLoad.current = false;
    })();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      if (!isFirstLoad.current) {
        loadData();
      }
    }, [loadData])
  );

  async function handleApprove(id: number) {
    try {
      await approveFaltante(id);
      setFaltantes((prev) => prev.filter((f) => f.id !== id));
    } catch {
      showToast("No se pudo aprobar el faltante", "error");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteFaltante(id);
      setFaltantes((prev) => prev.filter((f) => f.id !== id));
    } catch {
      showToast("No se pudo eliminar el faltante", "error");
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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-4 pb-2">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-3xl font-bold text-gray-900">
                Hola, {user.nombre.split(" ")[0]} 👋
              </Text>
              <TouchableOpacity
                onPress={() => router.navigate("/(tabs)/profile")}
                className="w-10 h-10 rounded-full bg-brand items-center justify-center"
              >
                <Feather name="user" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <View className="bg-brand-light self-start rounded-full px-3 py-1">
              <Text className="text-brand font-semibold text-xs">Rol: Dueño</Text>
            </View>
          </View>

          <View className="flex-row px-5 gap-3 mb-6">
            <MetricCard
              icon="alert-circle"
              label="Faltantes Hoy"
              value={`${metrics?.faltantes_hoy ?? 0}`}
              color="#DC2626"
              bgColor="#FEF2F2"
            />
            <MetricCard
              icon="users"
              label="Empleados Activos"
              value={`${metrics?.empleados_activos ?? 0}`}
              color="#00875A"
              bgColor="#E8F5E9"
            />
          </View>

          <View className="px-5 mb-2">
            <Text className="text-xl font-bold text-gray-900 mb-3">Acción Requerida: Faltantes</Text>
            {faltantes.map((f) => (
              <FaltanteCard
                key={f.id}
                {...f}
                onApprove={() => handleApprove(f.id)}
                onDelete={() => handleDelete(f.id)}
              />
            ))}
            {faltantes.length === 0 && (
              <View className="items-center py-4">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <Text className="text-gray-500 text-sm ml-2">No hay faltantes pendientes</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-3xl font-bold text-gray-900">
              Hola, {user?.nombre?.split(" ")[0] ?? "Usuario"} 👋
            </Text>
            <TouchableOpacity
                onPress={() => router.navigate("/(tabs)/profile")}
                className="w-10 h-10 rounded-full bg-brand items-center justify-center"
              >
                <Feather name="user" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <View className="bg-brand-light self-start rounded-full px-3 py-1">
              <Text className="text-brand font-semibold text-xs">Rol: Empleado</Text>
          </View>
        </View>

        <View className="px-5 mt-4 mb-6">
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/inventory?reportar=true")}
            className="bg-brand rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
          >
            <Feather name="plus" size={20} color="white" />
            <Text className="text-white font-bold text-base">Reportar Faltante</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5">
          <Text className="text-xl font-bold text-gray-900 mb-3">Inventario en Revisión</Text>
          {faltantes.map((f) => (
            <FaltanteCard key={f.id} {...f} showActions={false} />
          ))}
          {faltantes.length === 0 && (
            <View className="items-center py-4">
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <Feather name="check-circle" size={16} color="#10B981" />
                <Text className="text-gray-500 text-sm ml-2">No hay faltantes reportados</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}