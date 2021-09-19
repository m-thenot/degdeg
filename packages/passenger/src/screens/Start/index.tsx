import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Button from '@components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@internalTypes/navigation';
import { layout } from '@dagdag/common/theme';

const Start: React.FC<NativeStackScreenProps<AuthStackParamList, 'start'>> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />
      <Button
        text="Commencer"
        onPress={() => navigation.navigate('signInWithPhoneNumber')}
      />
    </SafeAreaView>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
    marginTop: layout.marginTop,
  },
  top: {
    flex: 1,
  },
});
