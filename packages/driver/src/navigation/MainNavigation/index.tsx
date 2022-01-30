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
import MyInformation from '@screens/MyInformation';
import PrebooksNavigation from '@navigation/PrebooksNavigation';
import Dev from '@screens/Dev';

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
            headerLeft: () => (
              <MenuHeader
                hasCalendarButton
                prebooksScreen="prebooks"
                navigation={navigation}
                backgroundColor="transparent"
                hasPaddingHorizontal
              />
            ),
          };
        }}>
        <Drawer.Screen name="home" component={Home} />
        <Drawer.Screen name="history" component={History} />
        <Drawer.Screen name="help" component={Help} />
        <Drawer.Screen name="my_information" component={MyInformation} />
        <Drawer.Screen name="wallet" component={Wallet} />
        <Drawer.Screen name="user" component={User} />
        <Drawer.Screen
          name="prebooks"
          component={PrebooksNavigation}
          options={{ headerShown: false }}
        />

        {__DEV__ && <Drawer.Screen name="dev" component={Dev} />}
      </Drawer.Navigator>
    </LocationProvider>
  );
};

export default MainNavigation;
