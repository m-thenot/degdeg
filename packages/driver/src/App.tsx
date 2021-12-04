import React from 'react';

import { AuthProvider } from '@context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { RecoilRoot } from 'recoil';
import { PortalProvider } from '@gorhom/portal';
import Toast from 'react-native-toast-message';
import { ToastConfig } from '@utils/toast';
import { layout } from '@dagdag/common/theme';
import { FIREBASE_REGION } from '@dagdag/common/constants';
import { firebase } from '@react-native-firebase/functions';

LogBox.ignoreLogs(['Setting a timer']);

if (__DEV__) {
  firebase
    .app()
    .functions(FIREBASE_REGION)
    .useFunctionsEmulator('http://localhost:5001');
}

const App = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <SafeAreaProvider>
          <PortalProvider>
            <AuthNavigation />
            <Toast config={ToastConfig} topOffset={40 + layout.spacer4} />
          </PortalProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
