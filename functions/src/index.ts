import * as functions from 'firebase-functions';
import * as geofirestore from 'geofirestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

import db from './utils/db';
import { generateRandomLocation } from './utils/generateRandomLocation';
import { isApiError } from './utils/error';

const REGION = 'asia-south1';
const CARS_COLLECTION = 'cars';

const GeoFirestore = geofirestore.initializeApp(admin.firestore() as any);

export const sendMessage = functions.region(REGION).https.onCall(async data => {
  const { userId } = data;
  const doc = await db.drivers.doc(userId).get();
  const driver = doc.data();

  await admin
    .messaging()
    .sendToDevice(
      driver!.tokens,
      {
        data: {
          driver: JSON.stringify(driver),
          message: 'Hello from cloud function',
        },
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    )
    .catch(error => {
      throw new functions.https.HttpsError('unknown', 'CLOUD MESSAGING ERROR', {
        message: error.message,
      });
    });

  functions.logger.info(`Message has been sent to ${userId}`);
  return {
    success: true,
  };
});

export const createOrder = functions.region(REGION).https.onCall(async data => {
  const { location } = data;
  const geocollection = GeoFirestore.collection(CARS_COLLECTION);

  const query = geocollection.near({
    center: new admin.firestore.GeoPoint(location.latitude, location.longitude),
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
