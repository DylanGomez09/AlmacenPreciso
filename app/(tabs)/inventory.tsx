import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { FaltanteCard } from "@/components/faltante-card";
import { Toast } from "@/components/toast";
import { getFaltantes, getCachedFaltantes, reportFaltante, approveFaltante, deleteFaltante, type Faltante } from "@/services/faltantes";

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reportar?: string }>();
  const { user } = useAuth();
  const [items, setItems] = useState<Faltante[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFirstLoad = useRef(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const isReported = useRef(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
  function showToast(message: string, type: "success" | "error" = "success") { setToast({ visible: true, message, type }); }

  useEffect(() => {
    if (params.reportar === "true" && !isReported.current) {
      setShowModal(true);
      isReported.current = true;
    }
  }, [params.reportar]);

  const loadItems = useCallback(async () => {
    try {
      const data = await getFaltantes();
      setItems(data);
    } catch {
      showToast("No se pudieron cargar los productos", "error");
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  useEffect(() => {
    (async () => {
      const cached = await getCachedFaltantes();
      if (cached) {
        setItems(cached);
      }
      await loadItems();
      setLoading(false);
      isFirstLoad.current = false;
    })();
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      if (!isFirstLoad.current) {
        loadItems();
      }
    }, [loadItems])
  );

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleApprove(id: number) {
    try {
      await approveFaltante(id);
      setItems((prev) => prev.filter((f) => f.id !== id));
    } catch {
      showToast("No se pudo aprobar el faltante", "error");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteFaltante(id);
      setItems((prev) => prev.filter((f) => f.id !== id));
    } catch {
      showToast("No se pudo eliminar el faltante", "error");
    }
  }

  async function handleReport() {
    if (!newName || !newCategory) {
      showToast("Completa todos los campos", "error");
      return;
    }
    setReportLoading(true);
    try {
      await reportFaltante({ nombre: newName, categoria: newCategory });
      showToast(`${newName} ha sido enviado a revisión.`);
      setNewName("");
      setNewCategory("");
      setShowModal(false);
      const data = await getFaltantes();
      setItems(data);
    } catch {
      showToast("No se pudo reportar el faltante", "error");
    } finally {
      setReportLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center" style={{ paddingTop: insets.top + 8 }}>
        <ActivityIndicator size="large" color="#00875A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Inventario</Text>
            <Text className="text-muted text-sm mt-1">
              {user?.rol === "dueño" ? "Gestiona los productos del almacén" : "Productos reportados como faltantes"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Feather name="refresh-cw" size={18} color="#00875A" />
          </TouchableOpacity>
        </View>
      </View>

        <View className="flex-row items-center px-5 mb-4">
          <View className="flex-1 flex-row items-center bg-white rounded-2xl border border-gray-200 px-4 py-3">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="Buscar productos..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="w-12 h-12 bg-brand rounded-2xl items-center justify-center ml-2"
          >
            <Feather name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00875A" colors={["#00875A"]} />}
      >
        {filtered.map((item) => (
          <FaltanteCard
            key={item.id}
            {...item}
            showActions={user?.rol === "dueño"}
            onApprove={user?.rol === "dueño" ? () => handleApprove(item.id) : undefined}
            onDelete={user?.rol === "dueño" ? () => handleDelete(item.id) : undefined}
          />
        ))}
        {filtered.length === 0 && (
          <View className="items-center py-4">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <Feather name="package" size={16} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm ml-2">No se encontraron productos</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-3xl p-6">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-gray-900">Reportar Faltante</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-gray-700 mb-2">Nombre del producto</Text>
            <TextInput
              className="bg-surface rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 mb-4"
              placeholder="Ej: Leche deslactosada"
              placeholderTextColor="#9CA3AF"
              value={newName}
              onChangeText={setNewName}
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Categoría</Text>
            <TextInput
              className="bg-surface rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 mb-6"
              placeholder="Ej: Lácteos"
              placeholderTextColor="#9CA3AF"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <TouchableOpacity
              onPress={handleReport}
              disabled={reportLoading}
              className="bg-brand rounded-xl py-4 items-center flex-row justify-center gap-2"
            >
              {reportLoading && <ActivityIndicator size="small" color="white" />}
              <Text className="text-white font-bold text-base">
                {reportLoading ? "Enviando..." : "Enviar Reporte"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}