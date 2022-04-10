import {
  BookingStackParamList,
  DrawerNavigatorParamList,
} from '@internalTypes/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '@screens/Booking/Home';
import Cars from '@screens/Booking/Cars';
import Addresses from '@screens/Booking/Addresses';
import PickPoint from '@screens/Booking/PickPoint';
import SelectDate from '@screens/Booking/SelectDate';
import { DrawerScreenProps } from '@react-navigation/drawer';
import PrebookConfirmation from '@screens/Booking/PrebookConfirmation';

const BookingStack = createStackNavigator<BookingStackParamList>();

const BookingNavigation: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'booking'>
> = () => {
  return (
    <BookingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <BookingStack.Screen name="home" component={Home} />
      <BookingStack.Screen name="addresses" component={Addresses} />
      <BookingStack.Screen name="pickPoint" component={PickPoint} />
      <BookingStack.Screen name="cars" component={Cars} />
      <BookingStack.Screen
        name="prebookConfirmation"
        component={PrebookConfirmation}
      />
      <BookingStack.Screen
        name="selectDate"
        component={SelectDate}
        options={{
          headerTransparent: false,
        }}
      />
    </BookingStack.Navigator>
  );
};

export default BookingNavigation;
