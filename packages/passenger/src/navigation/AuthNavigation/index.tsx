import React, { useRef } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInWithPhoneNumber from '@screens/SignInWithPhoneNumber';
import Start from '@screens/Start';
import { AuthStackParamList, RootParamList } from '@internalTypes/navigation';
import { BackHeader } from '@dagdag/common/components';
import Verification from '@screens/Verification/index';
import MainNavigation from '@navigation/MainNavigation';
import Information from '@screens/Information';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import SplashScreen from '@screens/SplashScreen';
import { colors } from '@dagdag/common/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  const { user, isLoading } = useFirebaseAuthentication();
  const insets = useSafeAreaInsets();
  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef<RootParamList>();

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        screenOptions={({ navigation }) => {
          return {
            cardStyle: {
              backgroundColor: colors.white,
            },
            header: () => (
              <BackHeader
                hasPaddingHorizontal
                navigation={navigation}
                marginTop={insets.top}
              />
            ),
          };
        }}>
        {user ? (
          user.displayName ? (
            <Stack.Screen
              name="main"
              component={MainNavigation}
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />
          ) : (
            <Stack.Screen name="information" component={Information} />
          )
        ) : (
          <>
            <Stack.Screen
              name="start"
              component={Start}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signInWithPhoneNumber"
              component={SignInWithPhoneNumber}
            />
            <Stack.Screen name="verification" component={Verification} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
