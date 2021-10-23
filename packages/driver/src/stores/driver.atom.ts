import { atom } from 'recoil';

export const isAvailableState = atom<boolean>({
  key: 'isAvailable',
  default: false,
});
