import { Platform } from "react-native";
import Constants from "expo-constants";
import { api } from "./api";

const isExpoGo = Constants.executionEnvironment === "storeClient";

export async function registerForPushNotifications() {
  if (isExpoGo) return;
  try {
    const Device = await import("expo-device");
    const Notifications = await import("expo-notifications");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (!Device.default.isDevice) return;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    await api.post("/usuarios/push-token", {
      token: tokenData.data,
      plataforma: Platform.OS,
    });
  } catch {}
}

export async function setupNotificationListener(
  handleNotification: (data: Record<string, unknown>) => void
) {
  if (isExpoGo) return;
  try {
    const Notifications = await import("expo-notifications");
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotification(response.notification.request.content.data as Record<string, unknown>);
      });
    return subscription;
  } catch {}
}
