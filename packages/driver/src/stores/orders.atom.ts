import { IOrder } from '@dagdag/common/types';
import { atom, selector } from 'recoil';

export const ordersState = atom<IOrder[]>({
  key: 'orders',
  default: [],
});

export const currentOrderState = selector<IOrder | null>({
  key: 'currentOrder',
  get: ({ get }) => {
    const orders = get(ordersState);

    return orders.length > 0 ? orders[0] : null;
  },
});
