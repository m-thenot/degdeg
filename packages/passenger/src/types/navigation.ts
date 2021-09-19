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
};

export type DrawerNavigatorParamList = {
  booking: undefined;
  myRides: undefined;
  payment: undefined;
  help: undefined;
};
