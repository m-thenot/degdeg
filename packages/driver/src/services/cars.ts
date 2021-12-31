import * as geofirestore from 'geofirestore';
import firestore from '@react-native-firebase/firestore';
import { ILocation } from '@internalTypes/geo';
import { firebase } from '@react-native-firebase/functions';
import { CARS_COLLECTION, FIREBASE_REGION } from '@dagdag/common/constants';

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
  });
};

export const createCar = async (driverId: string, tokens: string[]) => {
  await firestore().collection(CARS_COLLECTION).doc(driverId).set({
    driverId: driverId,
    tokens: tokens,
  });
};

export const generateCars = async () => {
  await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('generateCars')({ size: 50 })
    .then(r => console.log(r))
    .catch(e => console.error('e', e.message));
};
