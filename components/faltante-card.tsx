import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface FaltanteCardProps {
  name: string;
  category: string;
  reporter: string;
  urgent?: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function FaltanteCard({
  name,
  category,
  reporter,
  urgent = false,
  onApprove,
  onDelete,
  showActions = true,
}: FaltanteCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-base font-bold text-gray-900">{name}</Text>
            {urgent && (
              <View className="bg-urgent-bg rounded-full px-2 py-0.5">
                <Text className="text-xs font-bold text-urgent-text">Urgente</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-muted">{category}</Text>
          <View className="flex-row items-center mt-1.5">
            <Feather name="user" size={12} color="#9CA3AF" />
            <Text className="text-xs text-muted ml-1">Reportó: {reporter}</Text>
          </View>
        </View>
        {showActions && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={onDelete}
              className="w-9 h-9 rounded-full bg-danger-bg items-center justify-center"
            >
              <Feather name="x" size={18} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApprove}
              className="w-9 h-9 rounded-full bg-success-bg items-center justify-center"
            >
              <Feather name="check" size={18} color="#10B981" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
