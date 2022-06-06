import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { border, colors, layout } from '@dagdag/common/theme';

interface IRoundBottomProps {
  customStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const RoundBottom: React.FC<IRoundBottomProps> = ({
  children,
  customStyle,
}) => {
  const styles = createStyles();
  return <View style={[styles.bottom, customStyle]}>{children}</View>;
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
