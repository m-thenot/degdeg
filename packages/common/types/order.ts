import { ICar } from './car';

export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  ON_SPOT = 'ON_SPOT',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED_BY_CUSTOMER = 'CANCELED_BY_CUSTOMER',
  CANCELED_BY_DRIVER = 'CANCELED_BY_DRIVER',
}

export enum RideType {
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

export interface IMetadataRoute {
  distance: number;
  duration: number;
  coordinates: ILocation[];
}

export interface IUser {
  id: string;
  firstName: string;
  phoneNumber: string;
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
  car: ICar;
  rideType: RideType;
  departureAt: number;
  price: any;
}
