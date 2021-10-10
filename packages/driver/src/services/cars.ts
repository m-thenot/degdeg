import * as geofirestore from 'geofirestore';
import firestore from '@react-native-firebase/firestore';
import { ILocation } from '@internalTypes/geo';
import { firebase } from '@react-native-firebase/functions';

const GeoFirestore = geofirestore.initializeApp(firestore() as any);

export const updatePosition = (driverId: string, location: ILocation) => {
  const geocollection = GeoFirestore.collection('cars');

  geocollection.doc(driverId).update({
    driverId: driverId,
    isAvailable: true,
    coordinates: new firestore.GeoPoint(location.latitude, location.longitude),
  });
};

export const createCar = async (driverId: string) => {
  await firestore().collection('cars').doc(driverId).set({
    driverId: driverId,
  });
};

export const generateCars = async () => {
  await firebase
    .app()
    .functions('asia-south1')
    .httpsCallable('generateCars')({ size: 50 })
    .then(r => console.log(r))
    .catch(e => console.log('e', e.message));
};
