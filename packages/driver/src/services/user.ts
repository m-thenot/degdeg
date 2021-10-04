import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const USERS_COLLECTION = 'drivers';

interface newUser {
  firstName: string;
  name: string;
  email: string;
  phoneNumber: string;
  uid: string;
}

export const createUser = async (newUser: newUser) => {
  const user = auth().currentUser;
  user?.updateProfile({
    displayName: newUser.firstName,
  });
  return await firestore()
    .collection(USERS_COLLECTION)
    .doc(newUser.uid)
    .set({ ...newUser, displayName: newUser.firstName });
};

export const logout = () => {
  auth().signOut();
};
