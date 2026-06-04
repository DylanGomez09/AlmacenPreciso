import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ visible, message, type = "success", onDismiss, duration = 2500 }: ToastProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 100, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onDismiss());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-[#10B981]" : "bg-[#EF4444]";
  const iconName = isSuccess ? "check-circle" : "alert-circle";

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        transform: [{ translateY }],
        opacity,
        zIndex: 9999,
      }}
    >
      <View className={`flex-row items-center ${bgColor} rounded-2xl px-5 py-4 shadow-lg`}>
        <Feather name={iconName} size={20} color="white" />
        <Text className="text-white font-semibold text-sm ml-3 flex-1">{message}</Text>
      </View>
    </Animated.View>
  );
}
