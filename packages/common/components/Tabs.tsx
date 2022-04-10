import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { border, colors, font, layout } from '../theme';

interface ITab {
  value: string;
  label: string;
}

interface ITabsProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  tabs: ITab[];
  customStyle?: StyleProp<ViewStyle>;
}

export const Tabs: React.FC<ITabsProps> = ({
  setActiveTab,
  tabs,
  activeTab,
  customStyle,
}) => {
  const nbTabs = tabs.length;
  const styles = createStyles(nbTabs);

  return (
    <View style={[styles.tabs, customStyle]}>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          onPress={() => setActiveTab(tab.value)}
          style={[
            styles.tab,
            index === 0 && styles.tabLeft,
            index === nbTabs - 1 && styles.tabRight,
            activeTab === tab.value && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.label,
              activeTab === tab.value && styles.activeLabel,
            ]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (nbTabs: number) => {
  const tabWidth = 100 / nbTabs + '%';

  return StyleSheet.create({
    tabs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: border.radius2,
      marginTop: layout.spacer2,
    },
    tab: {
      width: tabWidth,
      paddingVertical: layout.spacer3,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    tabLeft: {
      borderTopLeftRadius: border.radius2,
      borderBottomLeftRadius: border.radius2,
    },
    tabRight: {
      borderTopRightRadius: border.radius2,
      borderBottomRightRadius: border.radius2,
    },
    label: {
      textAlign: 'center',
      fontSize: font.fontSize1_5,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    activeLabel: {
      color: colors.white,
    },
  });
};
