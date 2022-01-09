import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import { OrderStatus } from '@dagdag/common/types';
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
