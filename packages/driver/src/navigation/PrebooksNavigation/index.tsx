import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PrebooksStackParamList } from '@internalTypes/navigation';
import { colors } from '@dagdag/common/theme';
import Prebooks from '@screens/Prebooks';
import PrebookDetail from '@screens/Prebooks/PrebookDetail';

const Stack = createStackNavigator<PrebooksStackParamList>();

const PrebooksNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={() => {
        return {
          cardStyle: {
            backgroundColor: colors.white,
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerShown: false,
        };
      }}>
      <Stack.Screen name="list" component={Prebooks} />
      <Stack.Screen name="detail" component={PrebookDetail} />
    </Stack.Navigator>
  );
};

export default PrebooksNavigation;
