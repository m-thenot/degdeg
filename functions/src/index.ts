import * as functions from 'firebase-functions';
import * as geofirestore from 'geofirestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

import db from './utils/db';
import { generateRandomLocation } from './utils/generateRandomLocation';
import { isApiError } from './utils/error';
import { IOrder } from './types/order';
import { sendMessages } from './services/sendMessages';

const REGION = 'asia-south1';
const CARS_COLLECTION = 'cars';

const GeoFirestore = geofirestore.initializeApp(admin.firestore() as any);

export const createOrder = functions.region(REGION).https.onCall(async data => {
  const order: IOrder = data.order;

  // Create order
  db.orders.add(order);

  // Notify drivers for this order within a radius of 4km
  const geocollection = GeoFirestore.collection(CARS_COLLECTION);

  const query = geocollection.near({
    center: new admin.firestore.GeoPoint(
      order.departureAddress.coordinates.latitude,
      order.departureAddress.coordinates.longitude,
    ),
    radius: 4,
  });

  let result;

  try {
    result = await query.get();
  } catch (error) {
    if (isApiError(error)) {
      throw new functions.https.HttpsError('unknown', error.message);
    }
    throw new functions.https.HttpsError('unknown', 'Create order failed');
  }

  const tokens = result.docs
    .slice(0, 15)
    .map(doc => doc.data().tokens)
    .flat()
    .filter(token => typeof token === 'string');

  functions.logger.info(tokens);
  sendMessages(tokens, { order: JSON.stringify(order) });

  return {
    nbCars: result.size,
    cars: result.docs.map(doc => doc.data()),
  };
});

export const generateCars = functions.region(REGION).https.onCall(data => {
  const { size } = data;

  const geocollection = GeoFirestore.collection(CARS_COLLECTION);
  const batch = GeoFirestore.batch();
  const randomLocations = generateRandomLocation(size);

  try {
    randomLocations.forEach((location, index) => {
      const docRef = geocollection.doc();
      batch.set(docRef, {
        driverId: index,
        isAvailable: true,
        coordinates: new admin.firestore.GeoPoint(
          location.latitude,
          location.longitude,
        ),
      });
    });

    batch.commit();
    functions.logger.info(`${size} documents added to cars collection`);
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError('unknown', 'GENERATE CARS ERROR', {
      message: error,
    });
  }

  return {
    success: true,
  };
});
