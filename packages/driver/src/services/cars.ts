import * as geofirestore from 'geofirestore';
import firestore from '@react-native-firebase/firestore';
import { ILocation } from '@internalTypes/geo';
import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION } from '@dagdag/common/constants';

const GeoFirestore = geofirestore.initializeApp(firestore() as any);

export const updatePosition = (driverId: string, location: ILocation) => {
  const geocollection = GeoFirestore.collection('cars');

  geocollection.doc(driverId).update({
    driverId: driverId,
    isAvailable: true,
    coordinates: new firestore.GeoPoint(location.latitude, location.longitude),
  });
};

export const createCar = async (driverId: string, tokens: string[]) => {
  await firestore().collection('cars').doc(driverId).set({
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
    .catch(e => console.log('e', e.message));
};
