import { ORDERS_COLLECTION } from '../constants';
import { IOrder } from '../types';
import firestore from '@react-native-firebase/firestore';

export const getOrder = async (orderId: string) => {
  const doc = await firestore()
    .collection(ORDERS_COLLECTION)
    .doc(orderId)
    .get();
  return doc?.data() as IOrder;
};
