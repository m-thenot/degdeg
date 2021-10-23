import React from 'react';

import { AuthProvider } from '@context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { RecoilRoot } from 'recoil';

LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <SafeAreaProvider>
          <AuthNavigation />
        </SafeAreaProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
