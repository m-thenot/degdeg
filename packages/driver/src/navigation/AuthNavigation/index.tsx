import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInWithPhoneNumber from '@screens/SignInWithPhoneNumber';
import { AuthStackParamList } from '@internalTypes/navigation';
import { BackHeader } from '@dagdag/common/components';
import Verification from '@screens/Verification/index';
import Information from '@screens/Information';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { colors } from '@dagdag/common/theme';
import MainNavigation from '@navigation/MainNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  const { user, isLoading } = useFirebaseAuthentication();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) {
      SplashScreen.hide();
    }
  }, []);

  return (
    <NavigationContainer>
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
              }}
            />
          ) : (
            <Stack.Screen name="information" component={Information} />
          )
        ) : (
          <>
            <Stack.Screen
              name="signInWithPhoneNumber"
              component={SignInWithPhoneNumber}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="verification" component={Verification} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
