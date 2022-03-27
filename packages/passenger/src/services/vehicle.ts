import { VEHICLES_COLLECTION } from '@dagdag/common/constants';
import { IVehicle } from '@dagdag/common/types';
import firestore from '@react-native-firebase/firestore';

export const getAllVehicleClass = async () => {
  const docs = await firestore()
    .collection(VEHICLES_COLLECTION)
    .where('isActive', '==', true)
    .get();
  return docs.docs.map(doc => doc.data()) as IVehicle[];
};
