import { Text, View } from "react-native";

interface EmployeeListItemProps {
  name: string;
  email: string;
  role: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function EmployeeListItem({ name, email, role }: EmployeeListItemProps) {
  return (
    <View className="flex-row items-center py-3 px-4 bg-white rounded-2xl mb-2 border border-gray-100 shadow-sm">
      <View className="w-10 h-10 rounded-full bg-brand-light items-center justify-center mr-3">
        <Text className="text-brand font-bold text-sm">{getInitials(name)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{name}</Text>
        <Text className="text-sm text-muted">{email}</Text>
      </View>
      <View className="bg-brand-light rounded-full px-2.5 py-0.5">
        <Text className="text-xs font-medium text-brand capitalize">{role}</Text>
      </View>
    </View>
  );
}
