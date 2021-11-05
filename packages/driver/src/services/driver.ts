import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { CARS_COLLECTION, DRIVERS_COLLECTION } from '@dagdag/common/constants';

interface newDriver {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  uid: string;
}

export const createDriver = async (newUser: newDriver) => {
  const user = auth().currentUser;
  user?.updateProfile({
    displayName: newUser.firstName,
  });
  return await firestore()
    .collection(DRIVERS_COLLECTION)
    .doc(newUser.uid)
    .set({ ...newUser, displayName: newUser.firstName });
};

export const logout = () => {
  auth().signOut();
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const saveTokenToDatabase = async token => {
  const userId = auth()?.currentUser?.uid;

  await firestore()
    .collection(DRIVERS_COLLECTION)
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });

  await firestore()
    .collection(CARS_COLLECTION)
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
};

export const updateDriver = async (newUser: Partial<IDriver>) => {
  const user = auth().currentUser;
  return await firestore()
    .collection(DRIVERS_COLLECTION)
    .doc(user?.uid)
    .update(newUser);
};
