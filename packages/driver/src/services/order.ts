import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import { IOrder, OrderStatus, RideType } from '@dagdag/common/types';
import firestore from '@react-native-firebase/firestore';

export const updateOrderStatus = (orderStatus: OrderStatus, uid: string) => {
  firestore().collection(ORDERS_COLLECTION).doc(uid).update({
    status: orderStatus,
  });
};

export const acceptOrder = (driver: any, uid: string) => {
  firestore().collection(ORDERS_COLLECTION).doc(uid).update({
    status: OrderStatus.ACCEPTED,
    driver,
  });
};

export const getOrdersByDate = async (
  driverId: string,
  date: number,
  dateNextDay: number,
) => {
  const docs = await firestore()
    .collection(ORDERS_COLLECTION)
    .where('driver.uid', '==', driverId)
    .where('departureAt', '>', date)
    .where('departureAt', '<', dateNextDay)
    .get();
  return docs.docs;
};

export const getPrebookOrders = async () => {
  const docs = await firestore()
    .collection(ORDERS_COLLECTION)
    .where('rideType', '==', RideType.LATER)
    .where('status', '==', OrderStatus.NEW)
    .get();
  return docs.docs;
};

export const getMyPrebookOrders = async (driverId: string) => {
  const docs = await firestore()
    .collection(ORDERS_COLLECTION)
    .where('driver.uid', '==', driverId)
    .where('rideType', '==', RideType.LATER)
    .where('status', '==', OrderStatus.ACCEPTED)
    .get();
  return docs.docs;
};

export const getOrder = async (orderId: string) => {
  const doc = await firestore()
    .collection(ORDERS_COLLECTION)
    .doc(orderId)
    .get();
  return doc?.data() as IOrder;
};
