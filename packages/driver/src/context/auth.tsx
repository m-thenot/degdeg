import React, { createContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

interface IUser {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tokens?: string[];
}

interface IContextProps {
  user: IUser | null | FirebaseFirestoreTypes.DocumentData;
  isLoading: boolean;
  confirmation: FirebaseAuthTypes.ConfirmationResult | null;
  setConfirmation: React.Dispatch<
    React.SetStateAction<
      FirebaseAuthTypes.ConfirmationResult | null | undefined
    >
  >;
}

const AuthContext = createContext<Partial<IContextProps>>({});

const AuthProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<
    IUser | null | FirebaseFirestoreTypes.DocumentData
  >();
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const onAuthStateChanged = async (
    authUser: FirebaseAuthTypes.User | null,
  ) => {
    if (authUser) {
      const { phoneNumber, uid, displayName } = authUser;
      const newUser = {
        phoneNumber: phoneNumber,
        uid: uid,
        displayName: displayName,
      };
      setUser(newUser);
    } else {
      setUser(undefined);
    }
    if (isLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const userSubscriber = firestore()
      .collection('drivers')
      .doc(user?.uid)
      .onSnapshot(documentSnapshot => {
        documentSnapshot?.data() && setUser(documentSnapshot.data());
      });

    return () => userSubscriber();
  }, [user?.uid]);

  return (
    <AuthContext.Provider
      value={{ isLoading, user, setConfirmation, confirmation }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
