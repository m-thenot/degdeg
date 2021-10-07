import { Button } from '@dagdag/common/components';
import { logout } from '@services/user';
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/functions';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';

const getHelloWorld = async (userId: string) => {
  const { data } = await firebase.functions().httpsCallable('sendMessage')({
    userId,
  });
  console.log('data', data);

  return data;
};

const Home: React.FC = () => {
  const { user } = useFirebaseAuthentication();

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    console.log(user?.uid);
    getHelloWorld(user?.uid);

    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <Button text="Se déconnecter" onPress={() => logout()} />
    </View>
  );
};

export default Home;
