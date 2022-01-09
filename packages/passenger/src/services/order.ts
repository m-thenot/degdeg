import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION } from '@dagdag/common/constants';
import { IOrder } from '@dagdag/common/types';
import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import firestore from '@react-native-firebase/firestore';

export const createOrder = async (order: IOrder) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('createOrder')({ order });
  return result.data;
};

export const updateOrder = (order: Partial<IOrder>, uid: string) => {
  firestore().collection(ORDERS_COLLECTION).doc(uid).update(order);
};

export const getUserOrders = async (userId: string) => {
  const docs = await firestore()
    .collection(ORDERS_COLLECTION)
    .where('user.id', '==', userId)
    .get();
  return docs.docs;
};
