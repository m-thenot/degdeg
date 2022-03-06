import { FIREBASE_REGION } from '@dagdag/common/constants';
import { firebase } from '@react-native-firebase/functions';

interface IRating {
  rating: number;
  overallRating?: number;
  ratingsCount?: number;
  isPassengerRating: boolean;
  uid: string;
}

export const updateRating = async (data: IRating) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('updateRating')(data);
  return result.data;
};
