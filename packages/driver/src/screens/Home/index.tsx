import { Button } from '@dagdag/common/components';
import { logout } from '@services/user';
import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { useLocation } from '@context/location';

const Home: React.FC = () => {
  const { location } = useLocation();
  const [order, setOrder] = useState<any>();

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('r', remoteMessage);
      setOrder(remoteMessage.data);

      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribe;

    /* messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('ooooooook', remoteMessage.data);
      setOrder(remoteMessage.data);
    }); */
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <Text>{location?.latitude}</Text>
      <Text>{location?.longitude}</Text>

      <Button text="Se déconnecter" onPress={() => logout()} />
    </View>
  );
};

export default Home;
