import { Tabs } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const OWNER_TABS = [
  { name: "index", label: "Inicio", icon: "home" as const },
  { name: "inventory", label: "Inventario", icon: "package" as const },
  { name: "employees", label: "Empleados", icon: "users" as const },
  { name: "profile", label: "Perfil", icon: "user" as const },
];

const EMPLOYEE_TABS = [
  { name: "index", label: "Inicio", icon: "home" as const },
  { name: "inventory", label: "Inventario", icon: "package" as const },
  { name: "employees", label: "Equipo", icon: "users" as const },
  { name: "profile", label: "Perfil", icon: "user" as const },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const { user } = useAuth();
  const tabs = user?.rol === "dueño" ? OWNER_TABS : EMPLOYEE_TABS;

  return (
    <View className="flex-row items-center justify-around bg-white border-t border-gray-200 px-2 py-2">
      {tabs.map((tab) => {
        const route = state.routes.find((r) => r.name === tab.name);
        if (!route) return null;
        const isActive = state.routes.indexOf(route) === state.index;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
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

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
}