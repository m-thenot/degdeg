import React from 'react';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './context/auth';
import AuthNavigation from './navigation/AuthNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { OrderProvider } from '@context/order';

LogBox.ignoreLogs(['Setting a timer']);

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <OrderProvider>
          <SafeAreaProvider>
            <AuthNavigation />
          </SafeAreaProvider>
        </OrderProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
