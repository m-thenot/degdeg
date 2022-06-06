import { MyRidesStackParamList } from '@internalTypes/navigation';
import React from 'react';
import RideDetails from '@screens/MyRides/RideDetails';
import DriverDetails from '@screens/MyRides/DriverDetails';
import MyRides from '@screens/MyRides';
import { createStackNavigator } from '@react-navigation/stack';

const MyRidesStack = createStackNavigator<MyRidesStackParamList>();

const RideNavigation: React.FC = () => {
  return (
    <MyRidesStack.Navigator
      screenOptions={() => ({
        headerShadowVisible: false,
        headerTransparent: true,
        headerBackVisible: false,
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
      })}>
      <MyRidesStack.Screen name="innerMyRides" component={MyRides} />
      <MyRidesStack.Screen name="rideDetails" component={RideDetails} />
      <MyRidesStack.Screen name="driverDetails" component={DriverDetails} />
    </MyRidesStack.Navigator>
  );
};

export default RideNavigation;
