enum CarType {
  ECONOMIC = 'ECONOMIC',
  PREMIUM = 'PREMIUM',
  VAN = 'VAN',
}

interface ICar {
  type: CarType;
  price: number;
}

enum OrderStatus {
  NEW = 'NEW',
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

export interface IOrder {
  createdDate: number;
  arrivalAddress: IAddress;
  departureAddress: IAddress;
  status: OrderStatus;
  userId: string;
  metadataRoute: IMetadataRoute;
  car: ICar;
  rideType: RideType;
  departureAt: number;
  price: any;
}
