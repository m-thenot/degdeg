export enum VehicleType {
  ECONOMIC = 'ECONOMIC',
  PREMIUM = 'PREMIUM',
  VAN = 'VAN',
  TAXI = 'TAXI',
}

export interface IVehicle {
  isActive: boolean;
  price: {
    base: number;
    perMinute: number;
  };
  type: VehicleType;
}
