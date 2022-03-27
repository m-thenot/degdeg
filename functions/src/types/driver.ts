import { VehicleType } from '@dagdag/common/types';

export interface IDriver {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tokens: string[];
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
