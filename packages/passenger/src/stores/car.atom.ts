import { CarType } from '@constants/car';
import { atom } from 'recoil';

interface ICar {
  type: CarType;
  price: number;
}

export const carState = atom<ICar | null>({
  key: 'car',
  default: null,
});
