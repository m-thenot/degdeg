import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Wallet: React.FC<
  DrawerNavigationProp<DrawerNavigatorParamList, 'wallet'>
> = () => {
  return (
    <SafeAreaView>
      <Text>Wallet</Text>
    </SafeAreaView>
  );
};

export default Wallet;
