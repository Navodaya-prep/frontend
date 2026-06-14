import { Platform } from 'react-native';
import { liveClassApi } from '../api/liveClassApi';

export async function registerPushToken() {
  try {
    // Dynamic require so Expo Go (which lacks the native module) doesn't crash
    // at module load time. The try/catch handles the missing-module error.
    const Notifications = require('expo-notifications');

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
