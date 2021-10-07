import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

import db from './utils/db';

export const sendMessage = functions.https.onCall(async data => {
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

  functions.logger.info(`Message has been sent to ${userId}`, {
    structuredData: true,
  });
  return {
    success: true,
  };
});
