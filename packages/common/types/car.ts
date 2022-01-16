export enum CarType {
  ECONOMIC = 'ECONOMIC',
  PREMIUM = 'PREMIUM',
  VAN = 'VAN',
  TAXI = 'TAXI',
}

export interface ICar {
  type: CarType;
  price: number;
}
