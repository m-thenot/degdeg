import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { layout } from '@dagdag/common/theme';

const Payment: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'payment'>
> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Paiement</Text>
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
    marginTop: layout.marginTop,
  },
});
