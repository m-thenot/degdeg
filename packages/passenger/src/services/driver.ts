import firestore from '@react-native-firebase/firestore';
import { DRIVERS_COLLECTION } from '@dagdag/common/constants';
import { IDriver } from '@dagdag/common/types';

export const getDriver = async (driverId: string) => {
  const doc = await firestore()
    .collection(DRIVERS_COLLECTION)
    .doc(driverId)
    .get();
  return doc?.data() as IDriver;
};
