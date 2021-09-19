import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Splash Screen</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
