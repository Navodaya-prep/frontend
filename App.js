import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { storage } from './src/utils/storage';
import { registerPushToken } from './src/utils/registerPushToken';
import i18n from './src/i18n';

// Show notifications while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    // Load saved language before rendering anything, so there is no flash of
    // English when the user has chosen Hindi.
    storage.getLanguage()
      .then(lang => { if (lang && lang !== i18n.language) return i18n.changeLanguage(lang); })
      .finally(() => setLangReady(true));

    // Register push token if already logged in.
    storage.getToken().then(token => { if (token) registerPushToken(); });
  }, []);

  if (!langReady) return null;

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
