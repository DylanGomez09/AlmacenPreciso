import { Text, View } from "react-native";

interface EmployeeListItemProps {
  name: string;
  position: string;
  initials: string;
  active?: boolean;
}

export function EmployeeListItem({ name, position, initials, active = true }: EmployeeListItemProps) {
  return (
    <View className="flex-row items-center py-3 px-4 bg-white rounded-2xl mb-2 border border-gray-100 shadow-sm">
      <View className="w-10 h-10 rounded-full bg-brand-light items-center justify-center mr-3">
        <Text className="text-brand font-bold text-sm">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{name}</Text>
        <Text className="text-sm text-muted">{position}</Text>
      </View>
      {active && (
        <View className="w-2.5 h-2.5 rounded-full bg-success" />
      )}
    </View>
  );
}
