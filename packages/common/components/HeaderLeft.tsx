import React from 'react';
import { StyleSheet } from 'react-native';
import BackButton from './../assets/icons/left-arrow.svg';
import MenuButton from './../assets/icons/ic_menu.svg';
import CrossButton from './../assets/icons/cross.svg';

import { layout } from '@dagdag/common/theme';
import { RoundIconButton } from './RoundIconButton';

interface IHeaderLeftProps {
  navigation: any;
}

interface ICrossHeader {
  onPress: () => void;
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
    <RoundIconButton
      style={hasMargin && styles.margin}
      onPress={() => (onPress ? onPress() : navigation.goBack())}>
      <BackButton style={styles.icon} width={18} height={18} />
    </RoundIconButton>
  );
};

export const MenuHeader: React.FC<IHeaderLeftProps> = ({ navigation }) => {
  const styles = createStyles();
  return (
    <RoundIconButton
      style={styles.margin}
      onPress={() => navigation.openDrawer()}>
      <MenuButton style={styles.icon} width={30} height={30} />
    </RoundIconButton>
  );
};

export const CrossHeader: React.FC<ICrossHeader> = ({ onPress }) => {
  const styles = createStyles();
  return (
    <RoundIconButton style={styles.margin} onPress={onPress}>
      <CrossButton width={16} height={16} />
    </RoundIconButton>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    icon: {
      marginLeft: -3,
    },
    margin: {
      marginLeft: layout.spacer2,
      marginTop: layout.spacer1,
      marginRight: layout.spacer2,
    },
  });
};
