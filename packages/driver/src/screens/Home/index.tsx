import { Button } from '@dagdag/common/components';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { logout } from '@services/user';
import React from 'react';
import { View, Text } from 'react-native';

const Home: React.FC = () => {
  const { user } = useFirebaseAuthentication();

  console.log(user);
  return (
    <View>
      <Text>Home</Text>
      <Button text="Se déconnecter" onPress={() => logout()} />
    </View>
  );
};

export default Home;
