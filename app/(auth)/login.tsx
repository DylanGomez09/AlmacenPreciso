import { useAuth } from "@/context/auth-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message?.includes("Network") ? "No se pudo conectar con el servidor. Verifica que el backend esté corriendo." : (e.message || "Error al iniciar sesión"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}
    >
      <View className="justify-center px-6">
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center mb-4">
            <Feather name="package" size={30} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">AlmacenPreciso</Text>
          <Text className="text-muted text-sm mt-1">Inicia sesión para continuar</Text>
        </View>

        {error && (
          <View className="bg-danger-bg rounded-xl px-4 py-3 mb-4">
            <Text className="text-danger text-sm font-medium">{error}</Text>
          </View>
        )}

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

        <View className="mb-6">
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

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-brand rounded-xl py-4 items-center shadow-sm mb-4"
        >
          <Text className="text-white font-bold text-base">
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/(auth)/register")}
        >
          <Text className="text-brand font-semibold text-sm">Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}