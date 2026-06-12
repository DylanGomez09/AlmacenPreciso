import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export async function storageSet(key: string, value: string) {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.default.setItem(key, value);
  } catch {}
}

export async function storageGet(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    return await AsyncStorage.default.getItem(key);
  } catch {
    return null;
  }
}

export async function storageDelete(key: string) {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.default.removeItem(key);
  } catch {}
}
