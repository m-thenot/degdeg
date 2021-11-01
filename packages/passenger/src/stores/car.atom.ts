import { ICar } from '@dagdag/common/types';
import { atom } from 'recoil';

export const carState = atom<ICar | null>({
  key: 'car',
  default: null,
});
