import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { layout } from '@dagdag/common/theme';

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
