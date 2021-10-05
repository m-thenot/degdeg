import { BookingStackParamList } from '@internalTypes/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '@screens/Booking/Home';
import Cars from '@screens/Booking/Cars';
import Addresses from '@screens/Booking/Addresses';
import PickPoint from '@screens/Booking/PickPoint';
import { BackHeader } from '@dagdag/common/components';
import { colors } from '@dagdag/common/theme';

const BookingStack = createNativeStackNavigator<BookingStackParamList>();

const BookingNavigation = () => {
  return (
    <BookingStack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerLeft: () => (
          <BackHeader navigation={navigation} hasMargin={true} />
        ),
      })}>
      <BookingStack.Screen name="home" component={Home} />
      <BookingStack.Screen name="addresses" component={Addresses} />
      <BookingStack.Screen
        name="pickPoint"
        component={PickPoint}
        options={{
          title: '',
          headerStyle: { backgroundColor: colors.white },
        }}
      />
      <BookingStack.Screen name="cars" component={Cars} />
    </BookingStack.Navigator>
  );
};

export default BookingNavigation;
