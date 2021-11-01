import { RideStackParamList } from '@internalTypes/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchForDriver from '@screens/Ride/SearchForDriver';

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
      <RideStack.Screen name="searchForDriver" component={SearchForDriver} />
    </RideStack.Navigator>
  );
};

export default RideNavigation;
