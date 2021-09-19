import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const Test = () => {
  const styles = createStyles();

  return <Text style={styles.test}>Je suis un composant de common</Text>;
};

export const createStyles = () => {
  const styles = StyleSheet.create({ test: { color: 'red' } });
  return styles;
};
