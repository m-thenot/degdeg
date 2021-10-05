import { Button } from '@dagdag/common/components';
import { logout, requestUserPermission } from '@services/user';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const Home: React.FC = () => {
  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <Button text="Se déconnecter" onPress={() => logout()} />
    </View>
  );
};

export default Home;
