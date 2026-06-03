import { Text, View } from "react-native";
import { type Feather } from "@expo/vector-icons";

interface MetricCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color?: string;
  bgColor?: string;
}

export function MetricCard({ icon, label, value, color = "#00875A", bgColor = "#E8F5E9" }: MetricCardProps) {
  const FeatherIcon = require("@expo/vector-icons").Feather as React.ComponentType<{
    name: keyof typeof Feather.glyphMap;
    size: number;
    color: string;
  }>;

  return (
    <View className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100">
      <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: bgColor }}>
        <FeatherIcon name={icon} size={20} color={color} />
      </View>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-sm text-muted mt-1">{label}</Text>
    </View>
  );
}
