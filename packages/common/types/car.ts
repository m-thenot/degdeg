export enum CarType {
  ECONOMIC = 'ECONOMIC',
  PREMIUM = 'PREMIUM',
  VAN = 'VAN',
}

export interface ICar {
  type: CarType;
  price: number;
}
