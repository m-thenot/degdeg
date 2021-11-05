import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MenuHeader } from '@dagdag/common/components';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, layout } from '@dagdag/common/theme';
import Home from '@screens/Home';
import { LocationProvider } from '@context/location';
import CustomDrawerContent from '@navigation/CustomDrawerContent';
import History from '@screens/History';
import Help from '@screens/Help';
import Wallet from '@screens/Wallet';
import User from '@screens/User';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const MainNavigation: React.FC = () => {
  return (
    <LocationProvider>
      <Drawer.Navigator
        initialRouteName="home"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => {
          return {
            headerBackTitleVisible: false,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleStyle: {
              marginTop: layout.spacer4,
            },
            headerStyle: {
              backgroundColor: 'transparent',
            },
            contentStyle: {
              backgroundColor: colors.white,
            },
            headerLeft: () => <MenuHeader navigation={navigation} hasMargin />,
          };
        }}>
        <Drawer.Screen name="home" component={Home} />
        <Drawer.Screen
          name="history"
          component={History}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="help"
          component={Help}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="user"
          options={{ headerTitle: 'Profil', headerTitleAlign: 'center' }}
          component={User}
        />
      </Drawer.Navigator>
    </LocationProvider>
  );
};

export default MainNavigation;
