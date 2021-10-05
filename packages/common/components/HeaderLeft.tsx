import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import BackButton from './../assets/icons/left-arrow.svg';
import MenuButton from './../assets/icons/ic_menu.svg';
import { colors, layout } from '@dagdag/common/theme';

interface IHeaderLeftProps {
  navigation: any;
}

interface IBackHeaderProps extends IHeaderLeftProps {
  hasMargin?: boolean;
  onPress?: () => void;
}

export const BackHeader: React.FC<IBackHeaderProps> = ({
  navigation,
  hasMargin = false,
  onPress,
}) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      style={[styles.button, hasMargin && styles.margin]}
      onPress={() => (onPress ? onPress() : navigation.goBack())}>
      <BackButton style={styles.icon} width={18} height={18} />
    </TouchableOpacity>
  );
};

export const MenuHeader: React.FC<IHeaderLeftProps> = ({ navigation }) => {
  const styles = createStyles();
  return (
    <TouchableOpacity
      style={[styles.button, styles.margin]}
      onPress={() => navigation.openDrawer()}>
      <MenuButton style={styles.icon} width={30} height={30} />
    </TouchableOpacity>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 35,
      width: 35,
      height: 35,
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
    icon: {
      marginLeft: -3,
    },
    margin: {
      marginLeft: layout.spacer1,
      marginTop: layout.spacer1,
      marginRight: layout.spacer2,
    },
  });
};
