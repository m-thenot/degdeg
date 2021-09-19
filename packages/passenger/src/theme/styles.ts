import { StyleSheet } from 'react-native';
import theme from '@theme';

const { font, colors } = theme;

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    fontSize: font.fontSize2,
  },
});

export default styles;
