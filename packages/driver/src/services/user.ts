import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const DRIVERS_COLLECTION = 'drivers';

interface newDriver {
  firstName: string;
  name: string;
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
