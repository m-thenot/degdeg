import React, { useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors } from '@dagdag/common/theme';
import crashlytics from '@react-native-firebase/crashlytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '@dagdag/common/components';

const Dev: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'dev'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Dev"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Test crashlytics"
        onPress={() => {
          crashlytics().crash();
        }}
      />
    </SafeAreaView>
  );
};

export default Dev;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
