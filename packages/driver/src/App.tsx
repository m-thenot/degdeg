import React from 'react';

import { AuthProvider } from '@context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AuthNavigation />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
