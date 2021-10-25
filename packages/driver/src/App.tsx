import React from 'react';

import { AuthProvider } from '@context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { RecoilRoot } from 'recoil';
import { PortalProvider } from '@gorhom/portal';

LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <SafeAreaProvider>
          <PortalProvider>
            <AuthNavigation />
          </PortalProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
