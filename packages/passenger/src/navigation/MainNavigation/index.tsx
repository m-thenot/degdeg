import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../CustomDrawerContent';
import { BackHeader, MenuHeader } from '@dagdag/common/components';
import Payment from '@screens/Payment';
import Help from '@screens/Help';
import MyRides from '@screens/MyRides';
import User from '@screens/User';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import BookingNavigation from '@navigation/BookingNavigation';
import { colors, layout } from '@dagdag/common/theme';
import RideNavigation from '@navigation/RideNavigation';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const MainNavigation: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="booking"
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
          headerLeft: () => <MenuHeader navigation={navigation} />,
        };
      }}>
      <Drawer.Screen
        name="booking"
        component={BookingNavigation}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="order"
        component={RideNavigation}
        options={{ headerShown: false }}
      />
      <Drawer.Group
        screenOptions={({ navigation }) => {
          return {
            headerTitleAlign: 'center',
            headerLeft: () => (
              <BackHeader navigation={navigation} hasMargin={true} />
            ),
          };
        }}>
        <Drawer.Screen
          name="user"
          options={{ headerTitle: 'Profil' }}
          component={User}
        />
        <Drawer.Screen name="myRides" component={MyRides} />
        <Drawer.Screen name="payment" component={Payment} />
        <Drawer.Screen
          name="help"
          options={{ headerTitle: "Besoin d'aide ?" }}
          component={Help}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default MainNavigation;
