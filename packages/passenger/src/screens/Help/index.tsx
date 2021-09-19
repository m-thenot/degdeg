import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import theme from '@theme';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';

const { layout } = theme;

const Help: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'help'>> =
  () => {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Un problème ?</Text>
      </SafeAreaView>
    );
  };

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
    marginTop: layout.marginTop,
  },
});
