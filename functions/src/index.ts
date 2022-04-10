/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as functions from 'firebase-functions';
import * as geofirestore from 'geofirestore';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

admin.initializeApp();

import db from './utils/db';
import { generateRandomLocation } from './utils/generateRandomLocation';
import { isApiError, isStripeError } from './utils/error';
import { IOrder } from './types/order';
import { IEmail } from './types/email';
import { sendMessages } from './services/sendMessages';
import nodemailer = require('nodemailer');
import { google } from 'googleapis';

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const REGION = 'asia-south1';
const CARS_COLLECTION = 'cars';
const PASSENGERS_COLLECTION = 'users';
const DRIVERS_COLLECTION = 'drivers';

const GeoFirestore = geofirestore.initializeApp(admin.firestore() as any);

/**
 * Create an order
 * Trigger by passenger
 */
export const createOrder = functions.region(REGION).https.onCall(async data => {
  const order: IOrder = data.order;

  // Create order
  const orderUid = uuidv4();
  order.uid = orderUid;
  db.orders.doc(orderUid).set(order);

  // Notify drivers for this order within a radius of 4km
  const geocollection = GeoFirestore.collection(CARS_COLLECTION);

  const query = geocollection
    .near({
      center: new admin.firestore.GeoPoint(
        order.departureAddress.coordinates.latitude,
        order.departureAddress.coordinates.longitude,
      ),
      radius: 4,
    })
    .where('isAvailable', '==', true);

  let result;

  try {
    result = await query.get();
  } catch (error) {
    functions.logger.error(error);
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
    orderUid,
  };
});

/**
 * Generate cars with random location, in order to simulate order on staging
 * Trigger by admin
 */
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

/**
 * SendEmail to DagDag Support
 */

exports.sendEmail = functions.region(REGION).https.onCall(async data => {
  const email: IEmail = data.email;

  try {
    const accessToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: CLIENT_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Support <dagdag.contact@gmail.com>',
      to: 'dagdag.contact@gmail.com',
      subject: `[SUPPORT] Message de ${email.firstName} (uid: ${email.uid}) `,
      text: email.from + '\n' + email.userType + ' \n\n' + email.message,
    };

    transporter.sendMail(mailOptions, error => {
      if (error) {
        throw new functions.https.HttpsError('unknown', error.message);
      }
    });
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError('unknown', 'EMAIL_ERROR');
  }

  return { success: true };
});

/**
 * Update rating
 */

exports.updateRating = functions.region(REGION).https.onCall(data => {
  const { rating, overallRating, ratingsCount, uid, isPassengerRating } = data;

  const newOverallRating = overallRating
    ? (overallRating * ratingsCount + rating) / (ratingsCount + 1)
    : rating;

  admin
    .firestore()
    .collection(isPassengerRating ? PASSENGERS_COLLECTION : DRIVERS_COLLECTION)
    .doc(uid)
    .update({
      rating: {
        overall: newOverallRating,
        count: ratingsCount ? ratingsCount + 1 : 1,
      },
    });

  return { success: true };
});

/**
 * Stripe: Setup intent
 */

exports.createSetupIntent = functions
  .region(REGION)
  .https.onCall(async data => {
    const { customerId = null, email = '', name = '', phoneNumber = '' } = data;
    const customer = customerId
      ? { id: customerId }
      : await stripe.customers.create({
          email: email,
          name: name,
          phone: phoneNumber,
        });
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2020-08-27' },
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    const clientSecret = setupIntent.client_secret;

    return { clientSecret, customerId: customer.id, ephemeralKey };
  });

/**
 * Stripe: get payment methods
 * */
exports.getPaymentMethods = functions
  .region(REGION)
  .https.onCall(async data => {
    const { customerId } = data;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return { paymentMethods };
  });

/**
 * Stripe: proceed to payment
 * */

exports.proceedToPayment = functions.region(REGION).https.onCall(async data => {
  const { customerId, paymentMethodId, amount } = data;

  try {
    await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    if (isStripeError(err)) {
      functions.logger.error('Error code is: ' + err.code);
      if (err.raw.payment_intent?.id) {
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
          err.raw.payment_intent.id,
        );
        functions.logger.error('PI retrieved: ' + paymentIntentRetrieved?.id);
      }

      throw new functions.https.HttpsError('unknown', 'PAYMENT_ERROR', {
        message: err.message,
        code: err.code,
      });
    } else {
      throw new functions.https.HttpsError('unknown', 'PAYMENT_ERROR');
    }
  }

  return { success: true };
});
