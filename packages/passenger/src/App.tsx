import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { OrderProvider } from '@context/order';
import Toast from 'react-native-toast-message';
import { ToastConfig } from '@utils/toast';
import { layout } from '@dagdag/common/theme';
import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION } from '@dagdag/common/constants';
import { initStripe } from '@stripe/stripe-react-native';

LogBox.ignoreLogs(['Setting a timer']);

if (__DEV__) {
  firebase
    .app()
    .functions(FIREBASE_REGION)
    .useFunctionsEmulator('http://localhost:5001');
}

const App: React.FC = () => {
  useEffect(() => {
    initStripe({
      publishableKey:
        'pk_test_51K3GSwAwMyMMt8Qnk93yvpJtaLj0gJEBGguu0nb9AuXp5cnhKdhM2Ck3k4xU6M4erzltpcZWuXl5Gr6AvCv8sZaZ00uhCYAk3H',
      urlScheme: 'dagdag',
    });
  }, []);
  return (
    <RecoilRoot>
      <AuthProvider>
        <OrderProvider>
          <SafeAreaProvider>
            <AuthNavigation />
            <Toast config={ToastConfig} topOffset={40 + layout.spacer4} />
          </SafeAreaProvider>
        </OrderProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
