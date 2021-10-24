import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION } from '@dagdag/common/constants';
import { IOrder } from '@dagdag/common/types';

export const createOrder = async (order: IOrder) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('createOrder')({ order });
  console.log(result);
};
