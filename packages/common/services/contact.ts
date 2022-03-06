import { FIREBASE_REGION } from '@dagdag/common/constants';
import { IEmail } from '@dagdag/common/types';
import { firebase } from '@react-native-firebase/functions';

export const sendEmail = async (email: IEmail) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('sendEmail')({ email });
  return result.data;
};
