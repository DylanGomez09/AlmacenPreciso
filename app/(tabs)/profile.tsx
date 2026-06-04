import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-gray-900">Perfil</Text>
      </View>

      <View className="mx-5 bg-white rounded-3xl p-6 items-center mb-6 shadow-sm border border-gray-100">
        <View className="w-20 h-20 rounded-full bg-brand items-center justify-center mb-4">
          <Feather name="user" size={36} color="white" />
        </View>
        <Text className="text-xl font-bold text-gray-900">{user?.nombre}</Text>
        <Text className="text-muted text-sm mt-1">{user?.email}</Text>
        <View className="bg-brand-light rounded-full px-4 py-1 mt-3">
          <Text className="text-brand font-semibold text-xs">
            {user?.rol === "dueño" ? "Dueño" : "Empleado"}
          </Text>
        </View>
      </View>

      <View className="mx-5 bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        <TouchableOpacity
          className="flex-row items-center px-4 py-4"
          onPress={() => Alert.alert("Notificaciones", "Próximamente podrás configurar tus alertas")}
        >
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Feather name="bell" size={20} color="#6B7280" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">Notificaciones</Text>
            <Text className="text-sm text-muted">Configura tus alertas</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#D1D5DB" />
        </TouchableOpacity>
        <View className="h-px bg-gray-100 mx-4" />
        <TouchableOpacity
          className="flex-row items-center px-4 py-4"
          onPress={() => Alert.alert("Cambiar contraseña", "Próximamente podrás actualizar tu contraseña")}
        >
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Feather name="shield" size={20} color="#6B7280" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">Seguridad</Text>
            <Text className="text-sm text-muted">Cambia tu contraseña</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      <View className="mx-5 mt-auto mb-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-white rounded-2xl py-4 border border-danger gap-2"
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text className="text-danger font-bold text-base">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}