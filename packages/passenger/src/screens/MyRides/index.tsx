import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { layout } from '@dagdag/common/theme';

const MyRides: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'myRides'>
> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Mes courses</Text>
    </SafeAreaView>
  );
};

export default MyRides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
    marginTop: layout.marginTop,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
