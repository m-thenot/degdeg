import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const History: React.FC<
  DrawerNavigationProp<DrawerNavigatorParamList, 'history'>
> = () => {
  return (
    <SafeAreaView>
      <Text>History</Text>
    </SafeAreaView>
  );
};

export default History;
