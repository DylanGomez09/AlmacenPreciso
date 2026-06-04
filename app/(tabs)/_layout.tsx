import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth-context";
import { Feather } from "@expo/vector-icons";

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
  const insets = useSafeAreaInsets();
  const tabs = user?.rol === "dueño" ? OWNER_TABS : EMPLOYEE_TABS;
  const positions = useRef<Record<string, { x: number; width: number }>>({});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slideWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const route = state.routes[state.index];
    if (route && positions.current[route.name]) {
      const { x, width } = positions.current[route.name];
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: x, useNativeDriver: false, friction: 8, tension: 60 }),
        Animated.spring(slideWidth, { toValue: width, useNativeDriver: false, friction: 8, tension: 60 }),
      ]).start();
    }
  }, [state.index]);

  return (
    <View
      className="flex-row items-center justify-around bg-white border-t border-gray-200 px-2 py-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 8,
          bottom: 4,
          left: slideAnim,
          width: slideWidth,
          backgroundColor: "#00875A",
          borderRadius: 999,
        }}
      />
      {tabs.map((tab) => {
        const route = state.routes.find((r: any) => r.name === tab.name);
        if (!route) return null;
        const isActive = state.routes.indexOf(route) === state.index;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              positions.current[tab.name] = { x, width };
              if (state.index === state.routes.indexOf(route)) {
                slideAnim.setValue(x);
                slideWidth.setValue(width);
              }
            }}
            className="flex-1 items-center py-2.5 mx-1"
          >
            <Feather name={tab.icon} size={22} color={isActive ? "white" : "#9CA3AF"} />
            <Text
              className="text-sm font-semibold mt-0.5"
              style={{ color: isActive ? "white" : "#9CA3AF" }}
            >
              {tab.label}
            </Text>
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