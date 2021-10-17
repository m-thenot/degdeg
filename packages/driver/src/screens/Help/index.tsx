import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Help: React.FC<DrawerNavigationProp<DrawerNavigatorParamList, 'help'>> =
  () => {
    return (
      <SafeAreaView>
        <Text>Help</Text>
      </SafeAreaView>
    );
  };

export default Help;
