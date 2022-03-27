import { IVehicle } from '@dagdag/common/types';
import { atom } from 'recoil';

export const vehicleState = atom<IVehicle | null>({
  key: 'vehicle',
  default: null,
});
