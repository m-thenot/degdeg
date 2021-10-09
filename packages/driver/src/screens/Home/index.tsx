import { Button } from '@dagdag/common/components';
import { logout } from '@services/user';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { useLocation } from '@context/location';

const Home: React.FC = () => {
  const { location } = useLocation();

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
