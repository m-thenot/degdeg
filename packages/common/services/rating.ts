import { FIREBASE_REGION } from '@dagdag/common/constants';
import { firebase } from '@react-native-firebase/functions';

if (__DEV__) {
  firebase
    .app()
    .functions(FIREBASE_REGION)
    .useFunctionsEmulator('http://localhost:5001');
}

interface IRating {
  rating: number;
  overallRating?: number;
  ratingsCount?: number;
  isPassengerRating: boolean;
  uid: string;
}

export const updateRating = async (data: IRating) => {
  console.log(data);
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('updateRating')(data);
  return result.data;
};
