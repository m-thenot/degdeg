import { IOrder } from '@dagdag/common/types';

export const sortByDepartureAtDesc = (a: IOrder, b: IOrder) =>
  a.departureAt - b.departureAt;
