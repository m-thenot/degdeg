import { VehicleType } from '@dagdag/common/types';

export interface IDriver {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tokens?: string[];
  image?: string;
  rating?: {
    overall: number;
    count: number;
  };
  car: {
    model: string;
    brand: string;
    color: string;
    plate?: string;
    type: VehicleType | null;
  };
  memberSince: number;
}
