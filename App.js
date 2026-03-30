import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { liveClassApi } from './src/api/liveClassApi';
import { storage } from './src/utils/storage';

// Show notifications while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotifications() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  const platform = Platform.OS;

  // Only send if logged in
  const authToken = await storage.getToken();
  if (authToken && token?.data) {
    liveClassApi.registerPushToken(token.data, platform).catch(() => {});
  }
}

export default function App() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
