import React from 'react';

import messaging from '@react-native-firebase/messaging';
import { AuthProvider } from '@context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
  console.log('oooooook');
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AuthNavigation />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
