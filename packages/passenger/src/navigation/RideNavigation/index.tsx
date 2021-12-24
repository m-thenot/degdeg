import { RideStackParamList } from '@internalTypes/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Ride from '@screens/Ride';
import CancelOrder from '@screens/Ride/CancelOrder';

const RideStack = createNativeStackNavigator<RideStackParamList>();

const RideNavigation = () => {
  return (
    <RideStack.Navigator
      screenOptions={() => ({
        headerShadowVisible: false,
        headerTransparent: true,
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
      })}>
      <RideStack.Screen name="ride" component={Ride} />
      <RideStack.Screen name="cancelOrder" component={CancelOrder} />
    </RideStack.Navigator>
  );
};

export default RideNavigation;
