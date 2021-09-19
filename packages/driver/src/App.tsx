import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Test } from '@dagdag/common/components';
import { colors, layout } from '@dagdag/common/theme';
import TestB from '@components/TestB';
import globalStyles from '@theme/globalStyles';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bienvenue sur driver</Text>
      <Test />
      <TestB />
      <Text style={globalStyles.error}>Je suis une erreur</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.marginHorizontal,
  },
  text: {
    color: colors.primary,
  },
});

export default App;
