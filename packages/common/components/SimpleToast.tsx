import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { border, colors, font, layout } from '../theme';

export interface ISimpleToast {
  message: string;
  type: 'error' | 'success';
}

export const SimpleToast: React.FC<ISimpleToast> = ({ message, type }) => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <View style={[styles.bar, type === 'error' && styles.barError]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingRight: layout.spacer4,
      paddingLeft: layout.spacer2,
      paddingVertical: layout.spacer2,
      borderRadius: border.radius2,
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
      minWidth: '90%',
      flexShrink: 1,
    },
    bar: {
      height: 30,
      width: 4,
      backgroundColor: colors.primary,
      borderRadius: border.radius2,
      marginRight: layout.spacer4,
    },
    barError: {
      backgroundColor: colors.error,
    },
    message: {
      color: colors.black,
      fontSize: font.fontSize2,
      flexWrap: 'wrap',
      flex: 1,
    },
  });
};
