import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../theme';

interface IRoundIconButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  height?: number;
}

export const RoundIconButton: React.FC<IRoundIconButtonProps> = ({
  children,
  onPress,
  style,
  size = 35,
}) => {
  const styles = createStyles(size);
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const createStyles = (size: number) => {
  return StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: size,
      width: size,
      height: size,
      shadowColor: colors.grey3,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      backgroundColor: colors.white,
      zIndex: 999,
    },
  });
};
