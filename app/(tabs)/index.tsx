import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import "./../../global.css";

const MOCK_PRODUCTOS = [
  { id: 1, nombre: "Leche deslactosada", actualizado_por: "Mamá", urgente: false },
  { id: 2, nombre: "Huevos (Docena)", actualizado_por: "Papá", urgente: false },
  { id: 3, nombre: "Pan de molde integral", actualizado_por: "Sistema", urgente: true },
];

const TABS = [
  { key: "inventario", label: "Inventario", icon: "list", active: true },
  { key: "pedidos", label: "Pedidos", icon: "shopping-cart", active: false },
  { key: "historial", label: "Historial", icon: "clock", active: false },
  { key: "ajustes", label: "Ajustes", icon: "settings", active: false },
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="bg-zinc-900"
    >
      {/* Card blanca centrada */}
      <View className="flex-1 mx-3 my-4 bg-slate-50 rounded-[24px] shadow-2xl overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-3">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="package-variant-closed" size={22} color="#1a4a40" />
            <Text className="text-lg font-bold text-brand">Almacén Preciso</Text>
          </View>
          <View className="w-9 h-9 bg-zinc-800 rounded-full items-center justify-center">
            <Feather name="user" size={16} color="white" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Título y badge */}
          <View className="px-5 pt-2 pb-4">
            <Text className="text-3xl font-bold text-black">Lista de Faltantes</Text>
            <View className="flex-row items-center self-start mt-2 bg-brand-light rounded-full px-3 py-1.5">
              <View className="w-2 h-2 rounded-full bg-green-600 mr-1.5" />
              <Text className="text-sm font-semibold text-green-800">
                12 productos pendientes
              </Text>
            </View>
          </View>

          {/* Input de búsqueda */}
          <View className="flex-row items-center px-5 mb-5">
            <View className="flex-1 flex-row items-center bg-white rounded-full border border-gray-200 px-4 py-3 mr-2">
              <Feather name="search" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900"
                placeholder="¿Qué hace falta?"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity className="w-12 h-12 bg-brand rounded-xl items-center justify-center">
              <Feather name="plus" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Lista de productos */}
          <View className="px-5 pb-4">
            {MOCK_PRODUCTOS.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-[16px] p-4 flex-row items-center mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-bold text-gray-900">
                      {item.nombre}
                    </Text>
                    {item.urgente && (
                      <View className="bg-urgent-bg rounded-full px-2 py-0.5">
                        <Text className="text-xs font-bold text-urgent-text">
                          Urgente
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Feather name="edit-3" size={12} color="#9CA3AF" />
                    <Text className="text-sm text-gray-500 ml-1">
                      Anotó: {item.actualizado_por}
                    </Text>
                  </View>
                </View>
                <View className="w-8 h-8 rounded-full border-2 border-gray-300 items-center justify-center">
                  <Feather name="check" size={14} color="#D1D5DB" />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        <View className="flex-row items-center justify-around bg-white/90 border-t border-gray-200 px-2 py-2">
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.key} className="items-center py-1">
              {tab.active ? (
                <View className="bg-brand rounded-full px-5 py-1.5 items-center">
                  <Feather name={tab.icon as any} size={20} color="white" />
                  <Text className="text-xs font-semibold text-white mt-0.5">
                    {tab.label}
                  </Text>
                </View>
              ) : (
                <View className="items-center px-4 py-1.5">
                  <Feather name={tab.icon as any} size={20} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 mt-0.5">{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
