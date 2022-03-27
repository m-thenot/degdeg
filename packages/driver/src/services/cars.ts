import * as geofirestore from 'geofirestore';
import firestore from '@react-native-firebase/firestore';
import { ILocation } from '@internalTypes/geo';
import { CARS_COLLECTION } from '@dagdag/common/constants';

const GeoFirestore = geofirestore.initializeApp(firestore() as any);

export const updatePosition = (
  driverId: string,
  location: ILocation,
  isAvailable: boolean,
) => {
  const geocollection = GeoFirestore.collection(CARS_COLLECTION);

  geocollection.doc(driverId).update({
    driverId: driverId,
    isAvailable: isAvailable,
    coordinates: new firestore.GeoPoint(location.latitude, location.longitude),
    // add vehicule type
  });
};

export const createCar = async (driverId: string, tokens: string[]) => {
  await firestore().collection(CARS_COLLECTION).doc(driverId).set({
    driverId: driverId,
    tokens: tokens,
  });
};
