import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import theme from '@theme';

const { colors, layout, font, border } = theme;

interface IButton {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: any;
  onPress: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
}

const Button: React.FC<IButton> = ({
  text,
  onPress,
  style,
  textStyle,
  type = 'primary',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabled,
        type === 'primary' ? styles.primary : styles.secondary,
        style,
      ]}
      disabled={disabled}
      activeOpacity={0.4}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          textStyle,
          type === 'primary' ? styles.textPrimary : styles.textSecondary,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: border.radius3,
    padding: layout.spacer4,
  },
  text: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: font.fontSize3,
  },
  disabled: {
    opacity: 0.4,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  textPrimary: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  textSecondary: {
    color: colors.primary,
  },
});
