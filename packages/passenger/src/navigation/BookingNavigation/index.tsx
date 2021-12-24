import { BookingStackParamList } from '@internalTypes/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '@screens/Booking/Home';
import Cars from '@screens/Booking/Cars';
import Addresses from '@screens/Booking/Addresses';
import PickPoint from '@screens/Booking/PickPoint';
import SelectDate from '@screens/Booking/SelectDate';

const BookingStack = createStackNavigator<BookingStackParamList>();

const BookingNavigation = () => {
  return (
    <BookingStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
      }}>
      <BookingStack.Screen name="home" component={Home} />
      <BookingStack.Screen name="addresses" component={Addresses} />
      <BookingStack.Screen name="pickPoint" component={PickPoint} />
      <BookingStack.Screen name="cars" component={Cars} />
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
