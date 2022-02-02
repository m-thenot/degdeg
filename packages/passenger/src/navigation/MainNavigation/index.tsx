import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../CustomDrawerContent';
import Payment from '@screens/Payment';
import Help from '@screens/Help';
import MyRides from '@screens/MyRides';
import User from '@screens/User';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import BookingNavigation from '@navigation/BookingNavigation';
import { colors, layout } from '@dagdag/common/theme';
import RideNavigation from '@navigation/RideNavigation';
import Dev from '@screens/Dev';
import { useOrder } from '@context/order';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const MainNavigation: React.FC = () => {
  const { orderUid } = useOrder();

  return (
    <Drawer.Navigator
      initialRouteName={orderUid ? 'order' : 'booking'}
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={() => {
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
      <Drawer.Screen name="user" component={User} />
      <Drawer.Screen name="myRides" component={MyRides} />
      <Drawer.Screen name="payment" component={Payment} />
      <Drawer.Screen name="help" component={Help} />
      {__DEV__ && <Drawer.Screen name="dev" component={Dev} />}
    </Drawer.Navigator>
  );
};

export default MainNavigation;
