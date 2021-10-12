import { ICar } from '@dagdag/common/constants';
import { atom } from 'recoil';

export const carState = atom<ICar | null>({
  key: 'car',
  default: null,
});
