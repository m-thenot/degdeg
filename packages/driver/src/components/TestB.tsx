import React from 'react';
import { Text, StyleSheet } from 'react-native';

const TestB = () => {
  return <Text style={styles.text}>Je suis un composant interne</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: 'yellow',
  },
});

export default TestB;
