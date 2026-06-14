import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { liveClassApi } from '../api/liveClassApi';

export async function registerPushToken() {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    const token = await Notifications.getExpoPushTokenAsync();
    if (token?.data) {
      await liveClassApi.registerPushToken(token.data, Platform.OS);
    }
  } catch {
    // Non-fatal — app works fine without push notifications
  }
}
