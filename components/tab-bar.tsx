import { Text, TouchableOpacity, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";

interface TabConfig {
  name: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const OWNER_TABS: TabConfig[] = [
  { name: "home", label: "Inicio", icon: "home" },
  { name: "inventory", label: "Inventario", icon: "package" },
  { name: "employees", label: "Empleados", icon: "users" },
];

const EMPLOYEE_TABS: TabConfig[] = [
  { name: "home", label: "Inicio", icon: "home" },
  { name: "inventory", label: "Inventario", icon: "package" },
  { name: "employees", label: "Equipo", icon: "users" },
];

export function TabBar() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0] || "home";
  const tabs = user?.rol === "dueño" ? OWNER_TABS : EMPLOYEE_TABS;

  return (
    <View className="flex-row items-center justify-around bg-white border-t border-gray-200 px-2 py-2">
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.replace(`/${tab.name}` as any)}
            className="items-center py-1 px-3"
          >
            {isActive ? (
              <View className="bg-brand rounded-full px-5 py-1.5 items-center">
                <Feather name={tab.icon} size={20} color="white" />
                <Text className="text-xs font-semibold text-white mt-0.5">
                  {tab.label}
                </Text>
              </View>
            ) : (
              <View className="items-center px-4 py-1.5">
                <Feather name={tab.icon} size={20} color="#9CA3AF" />
                <Text className="text-xs text-muted mt-0.5">{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
