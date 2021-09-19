import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, font } from '@dagdag/common/theme';

interface ILinkButton {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

const LinkButton: React.FC<ILinkButton> = ({
  text,
  onPress,
  disabled = false,
  style,
}) => {
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

export default LinkButton;

const styles = StyleSheet.create({
  text: {
    color: colors.primary,
    fontSize: font.fontSize2,
    textDecorationLine: 'underline',
  },
});
