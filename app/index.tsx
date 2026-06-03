import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";

function SplashView() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="w-20 h-20 rounded-2xl bg-brand items-center justify-center mb-6">
        <Feather name="package" size={36} color="white" />
      </View>
      <Text className="text-2xl font-bold text-brand mb-1">AlmacenPreciso</Text>
      <ActivityIndicator size="small" color="#00875A" className="mt-4" />
    </View>
  );
}

export default function Index() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <SplashView />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}