import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MenuHeader } from '@dagdag/common/components';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, layout } from '@dagdag/common/theme';
import Home from '@screens/Home';
import { LocationProvider } from '@context/location';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const MainNavigation: React.FC = () => {
  return (
    <LocationProvider>
      <Drawer.Navigator
        initialRouteName="home"
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
            headerLeft: () => <MenuHeader navigation={navigation} />,
          };
        }}>
        <Drawer.Screen
          name="home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </LocationProvider>
  );
};

export default MainNavigation;
