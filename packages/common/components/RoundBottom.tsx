import React from 'react';
import { StyleSheet, View } from 'react-native';
import { border, colors, layout } from '@dagdag/common/theme';

export const RoundBottom: React.FC = ({ children }) => {
  const styles = createStyles();
  return <View style={styles.bottom}>{children}</View>;
};

const createStyles = () => {
  return StyleSheet.create({
    bottom: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderTopLeftRadius: border.radius4,
      borderTopRightRadius: border.radius4,
      backgroundColor: colors.white,
      paddingHorizontal: layout.spacer5,
      paddingTop: layout.spacer5,
      paddingBottom: layout.spacer6,
    },
  });
};
