import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import theme from '@theme';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';

const { layout } = theme;

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
