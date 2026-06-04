import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  const plataforma = Platform.OS;

  await api.post("/usuarios/push-token", { token, plataforma });
}

export function setupNotificationListener(
  handleNotification: (data: Record<string, unknown>) => void
) {
  const subscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotification(response.notification.request.content.data as Record<string, unknown>);
    });
  return subscription;
}
