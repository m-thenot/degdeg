import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION, IOrder } from '@dagdag/common/constants';

export const createOrder = async (order: IOrder) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('createOrder')({ order });
  console.log(result);
};
