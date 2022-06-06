import { AddressType } from '@internalTypes/address';

export type AuthStackParamList = {
  start: undefined;
  signInWithPhoneNumber: undefined;
  verification: { phoneNumber: string };
  information: undefined;
  main: undefined;
};

export type BookingStackParamList = {
  home: undefined;
  addresses: undefined;
  cars: undefined;
  pickPoint: {
    type: AddressType;
  };
  selectDate: undefined;
  prebookConfirmation: undefined;
};

export type RideStackParamList = {
  ride: undefined;
  cancelOrder: undefined;
};

export type MyRidesStackParamList = {
  innerMyRides: undefined;
  rideDetails: {
    orderId: string;
  };
  driverDetails: {
    driverId: string;
  };
};

export type DrawerNavigatorParamList = {
  booking: undefined;
  myRides: MyRidesStackParamList;
  payment: undefined;
  help: undefined;
  order: undefined;
  user: undefined;
  dev?: undefined;
};

export type RootParamList =
  | DrawerNavigatorParamList
  | BookingStackParamList
  | AuthStackParamList
  | RideStackParamList;
