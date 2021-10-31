import { OrderStatus } from '@dagdag/common/types';
import { atom, selector } from 'recoil';
import { currentOrderState } from './orders.atom';

export const isOnlineState = atom<boolean>({
  key: 'isOnline',
  default: false,
});

export const isAvailableState = selector({
  key: 'isAvailableState',
  get: ({ get }) => {
    const isOnline = get(isOnlineState);
    const currentOrder = get(currentOrderState);

    const isNotInService =
      !currentOrder || currentOrder.status === OrderStatus.NEW;

    return isOnline && isNotInService;
  },
});
