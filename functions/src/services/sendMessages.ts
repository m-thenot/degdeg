import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const sendMessages = async (tokens: string[], data: any) => {
  const response = await admin
    .messaging()
    .sendMulticast({
      tokens,
      data: {
        order: data.order,
      },
      notification: {
        title: 'Une nouvelle course est disponible !',
        body: `${
          JSON.parse(data.order).user?.firstName
        } a besoin d'un chauffeur.`,
      },
      apns: {
        payload: {
          aps: {
            content_available: true,
          },
          headers: {
            'apns-push-type': 'background',
            'apns-priority': '5',
          },
        },
      },
      android: {
        priority: 'high',
      },
    })
    .catch(error => {
      throw new Error(error.message);
    });

  functions.logger.info(response);
};
