import * as admin from 'firebase-admin';

export const sendMessages = async (tokens: string[], data: any) => {
  await admin
    .messaging()
    .sendToDevice(
      tokens,
      {
        data: {
          order: data.order,
        },
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    )
    .catch(error => {
      throw new Error(error.message);
    });
};
