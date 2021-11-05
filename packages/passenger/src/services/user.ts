import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { USERS_COLLECTION } from '@dagdag/common/constants';
import { IUser } from '@internalTypes/user';

interface newUser {
  firstName: string;
  lastName: string;
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

export const updateUser = async (newUser: Partial<IUser>) => {
  const user = auth().currentUser;
  return await firestore()
    .collection(USERS_COLLECTION)
    .doc(user?.uid)
    .update(newUser);
};

export const logout = () => {
  auth().signOut();
};
