import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '@dagdag/common/theme';

interface ILoader {
  style?: StyleProp<ViewStyle>;
}

export const Loader: React.FC<ILoader> = ({ style }) => {
  const styles = createStyles();
  return (
    <ActivityIndicator
      size="large"
      color={colors.primary}
      style={[styles.loader, style]}
    />
  );
};

const createStyles = () => {
  return StyleSheet.create({
    loader: {
      flex: 1,
      alignSelf: 'center',
      marginTop: -100,
    },
  });
};
