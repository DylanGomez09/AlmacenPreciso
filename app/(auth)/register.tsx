import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";

type RoleTab = "dueño" | "empleado";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<RoleTab>("dueño");
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { register } = await import("@/services/auth");
      await register({
        nombre: name,
        email,
        password,
        rol: activeTab,
        ...(activeTab === "empleado" && code ? { codigo_unico: code } : {}),
      });
      await login(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message?.includes("Network") ? "No se pudo conectar con el servidor. Verifica que el backend esté corriendo." : (e.message || "Error al crear cuenta"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
      >
        <View className="justify-center px-6">
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center mb-4">
              <Feather name="user-plus" size={30} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">Crear Cuenta</Text>
            <Text className="text-muted text-sm mt-1">Regístrate para comenzar</Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Tipo de Cuenta</Text>
            <TouchableOpacity
              onPress={() => setShowRolePicker(true)}
              className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4 py-3.5"
            >
              <Feather name={activeTab === "dueño" ? "briefcase" : "user"} size={18} color="#9CA3AF" />
              <Text className="flex-1 ml-3 text-base text-gray-900">
                {activeTab === "dueño" ? "Dueño" : "Empleado"}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Modal visible={showRolePicker} transparent animationType="fade">
            <TouchableOpacity
              className="flex-1 bg-black/40 justify-center px-6"
              activeOpacity={1}
              onPress={() => setShowRolePicker(false)}
            >
              <View className="bg-white rounded-3xl overflow-hidden">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => { setActiveTab("dueño"); setShowRolePicker(false); setError(""); }}
                  className={`flex-row items-center px-5 py-4 ${activeTab === "dueño" ? "bg-brand-light" : ""}`}
                >
                  <Feather name="briefcase" size={20} color="#00875A" />
                  <View className="ml-3">
                    <Text className="text-base font-semibold text-gray-900">Dueño</Text>
                    <Text className="text-sm text-muted">Administra tu negocio</Text>
                  </View>
                  {activeTab === "dueño" && (
                    <Feather name="check" size={20} color="#00875A" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
                <View className="h-px bg-gray-100" />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => { setActiveTab("empleado"); setShowRolePicker(false); setError(""); }}
                  className={`flex-row items-center px-5 py-4 ${activeTab === "empleado" ? "bg-brand-light" : ""}`}
                >
                  <Feather name="user" size={20} color="#00875A" />
                  <View className="ml-3">
                    <Text className="text-base font-semibold text-gray-900">Empleado</Text>
                    <Text className="text-sm text-muted">Únete a una empresa</Text>
                  </View>
                  {activeTab === "empleado" && (
                    <Feather name="check" size={20} color="#00875A" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {error && (
            <View className="bg-danger-bg rounded-xl px-4 py-3 mb-4">
              <Text className="text-danger text-sm font-medium">{error}</Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Nombre Completo</Text>
            <View className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4">
              <Feather name="user" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3.5 ml-3 text-base text-gray-900"
                placeholder="Tu nombre"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</Text>
            <View className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4">
              <Feather name="mail" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3.5 ml-3 text-base text-gray-900"
                placeholder="tu@correo.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Contraseña</Text>
            <View className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4">
              <Feather name="lock" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3.5 ml-3 text-base text-gray-900"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</Text>
            <View className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4">
              <Feather name="lock" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3.5 ml-3 text-base text-gray-900"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1">
                <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === "empleado" && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Código de Unión</Text>
              <View className="flex-row items-center bg-surface rounded-xl border border-gray-200 px-4">
                <Feather name="key" size={18} color="#9CA3AF" />
                <TextInput
                  className="flex-1 py-3.5 ml-3 text-base text-gray-900"
                  placeholder="Código del dueño"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  value={code}
                  onChangeText={setCode}
                />
              </View>
            </View>
          )}

          <View className="mb-6" />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-brand rounded-xl py-4 items-center shadow-sm mb-4"
          >
            <Text className="text-white font-bold text-base">
              {loading ? "Creando cuenta..." : `Crear Cuenta como ${activeTab === "dueño" ? "Dueño" : "Empleado"}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => router.back()}
          >
            <Text className="text-brand font-semibold text-sm">¿Ya tienes cuenta? Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}