import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';
import BackButton from './../assets/icons/left-arrow.svg';
import MenuButton from './../assets/icons/ic_menu.svg';
import CrossButton from './../assets/icons/cross.svg';

import { layout, font, colors } from '@dagdag/common/theme';
import { RoundIconButton } from './RoundIconButton';

interface IHeaderProps {
  navigation: any;
  marginTop?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  hasPaddingHorizontal?: boolean;
}

interface ICrossHeader {
  onPress: () => void;
}

interface IBackHeaderProps extends IHeaderProps {
  onPress?: () => void;
  title?: string;
}

interface IMenuHeaderProps extends IHeaderProps {}

export const BackHeader: React.FC<IBackHeaderProps> = ({
  navigation,
  title = '',
  marginTop = 0,
  hasPaddingHorizontal,
  backgroundColor = colors.white,
  style,
  onPress,
}) => {
  const styles = createStyles();

  return (
    <View
      style={[
        styles.header,
        { marginTop: marginTop, backgroundColor: backgroundColor },
        hasPaddingHorizontal && styles.paddingHorizontal,
        style,
      ]}>
      <RoundIconButton
        style={[styles.iconButton]}
        onPress={() => (onPress ? onPress() : navigation.goBack())}>
        <BackButton style={styles.icon} width={18} height={18} />
      </RoundIconButton>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export const MenuHeader: React.FC<IMenuHeaderProps> = ({
  navigation,
  marginTop = 0,
  backgroundColor = colors.white,
  hasPaddingHorizontal,
  style,
}) => {
  const styles = createStyles();
  return (
    <View
      style={[
        styles.header,
        { marginTop: marginTop, backgroundColor: backgroundColor },
        style,
        hasPaddingHorizontal && styles.paddingHorizontal,
      ]}>
      <RoundIconButton
        style={[styles.iconButton, styles.iconMenuButton]}
        onPress={() => navigation.openDrawer()}>
        <MenuButton style={styles.icon} width={30} height={30} />
      </RoundIconButton>
    </View>
  );
};

export const CrossHeader: React.FC<ICrossHeader> = ({ onPress }) => {
  const styles = createStyles();
  return (
    <RoundIconButton style={styles.iconButton} onPress={onPress}>
      <CrossButton width={16} height={16} />
    </RoundIconButton>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    header: {
      paddingTop: layout.spacer2,
      minHeight: 50 + layout.spacer2,
      maxHeight: 50 + layout.spacer2,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      zIndex: 1000,
    },
    paddingHorizontal: {
      paddingHorizontal: layout.marginHorizontal,
    },
    icon: {
      marginLeft: -3,
    },
    iconButton: {
      marginRight: layout.spacer2,
    },
    iconMenuButton: {
      marginTop: layout.spacer4,
    },
    title: {
      fontSize: font.fontSize3,
      color: colors.black,
      transform: [{ translateX: -17 }],
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
    },
  });
};
