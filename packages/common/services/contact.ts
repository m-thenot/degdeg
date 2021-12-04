import { FIREBASE_REGION } from '@dagdag/common/constants';
import { IEmail } from '@dagdag/common/types';
import { firebase } from '@react-native-firebase/functions';

if (__DEV__) {
  firebase
    .app()
    .functions(FIREBASE_REGION)
    .useFunctionsEmulator('http://localhost:5001');
}

export const sendEmail = async (email: IEmail) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('sendEmail')({ email });
  return result.data;
};
