import { VehicleType, IVehicle, PAYMENT_TYPE } from '@dagdag/common/types';

enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  ON_SPOT = 'ON_SPOT',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED_BY_CUSTOMER = 'CANCELED_BY_CUSTOMER',
  CANCELED_BY_DRIVER = 'CANCELED_BY_DRIVER',
}

enum RideType {
  NOW = 'NOW',
  LATER = 'LATER',
}

interface IAddress {
  formattedAddress: string;
  coordinates: ILocation;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IMetadataRoute {
  distance: number;
  duration: number;
  coordinates: ILocation[];
}

interface IUser {
  id: string;
  firstName: string;
  phoneNumber: string;
  image?: string;
  rating?: {
    overall: number;
    count: number;
  };
}

export interface IPublicDriver {
  uid: string;
  firstName: string;
  phoneNumber: string;
  image?: string;
  rating?: {
    overall: number;
    count: number;
  };
  car?: {
    model: string;
    brand: string;
    color: string;
    plate?: string | undefined;
    type: VehicleType | null;
  };
}

export interface IOrder {
  uid: string;
  createdDate: number;
  arrivalAddress: IAddress;
  departureAddress: IAddress;
  status: OrderStatus;
  cancelReason?: string;
  user: IUser;
  metadataRoute: IMetadataRoute;
  vehicle: IVehicle;
  rideType: RideType;
  departureAt: number;
  price: number;
  driver?: IPublicDriver;
  paymentType: PAYMENT_TYPE;
}
