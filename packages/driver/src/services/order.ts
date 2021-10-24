import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import { OrderStatus } from '@dagdag/common/types';
import firestore from '@react-native-firebase/firestore';

export const updateOrderStatus = (orderStatus: OrderStatus, uid: string) => {
  firestore().collection(ORDERS_COLLECTION).doc(uid).update({
    status: orderStatus,
  });
};
