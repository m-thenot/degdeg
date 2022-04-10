import { IOrder, IVehicle } from '@dagdag/common/types';

export const sortByDepartureAtDesc = (a: IOrder, b: IOrder) =>
  b.departureAt - a.departureAt;

export const sortByDepartureAtAsc = (a: IOrder, b: IOrder) =>
  a.departureAt - b.departureAt;

export const sortByPrice = (a: IVehicle, b: IVehicle) =>
  (a.price?.base || 100000) - (b.price?.base || 100000);
