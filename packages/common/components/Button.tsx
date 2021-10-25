import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { colors, layout, border, font } from '../theme';

interface IButton {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: any;
  onPress: () => void;
  icon?: any;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<IButton> = ({
  text,
  onPress,
  style,
  textStyle,
  type = 'primary',
  disabled = false,
  isLoading = false,
  icon,
}) => {
  const styles = createStyles();
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
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={type === 'primary' ? colors.white : colors.black}
        />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              textStyle,
              type === 'primary' ? styles.textPrimary : styles.textSecondary,
            ]}>
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = () => {
  const styles = StyleSheet.create({
    button: {
      borderRadius: border.radius3,
      padding: layout.spacer4,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.grey3,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
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
    },
    textSecondary: {
      color: colors.black,
    },
    icon: {
      marginRight: layout.spacer2,
    },
  });

  return styles;
};
