import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, font } from '@dagdag/common/theme';

interface ILinkButton {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export const LinkButton: React.FC<ILinkButton> = ({
  text,
  onPress,
  disabled = false,
  style,
}) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      disabled={disabled}
      style={style}
      activeOpacity={0.4}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    text: {
      color: colors.primary,
      fontSize: font.fontSize2,
      textDecorationLine: 'underline',
    },
  });
};
