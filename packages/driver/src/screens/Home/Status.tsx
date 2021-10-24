import { colors, font, layout } from '@dagdag/common/theme';
import { isAvailableState } from '@stores/driver.atom';
import { ordersState } from '@stores/orders.atom';
import React, { useEffect, useState } from 'react';
import { Switch, StyleSheet, View, Text } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';

const Status: React.FC = () => {
  const [isAvailable, setIsAvailable] = useRecoilState(isAvailableState);
  const [isEnabled, setIsEnabled] = useState(isAvailable);
  const setOrders = useSetRecoilState(ordersState);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setIsAvailable(previousState => !previousState);
  };

  useEffect(() => {
    if (isEnabled !== isAvailable) {
      setIsEnabled(isAvailable);
    }
    if (!isAvailable) {
      setOrders([]);
    }
  }, [isAvailable]);

  return (
    <View style={styles.status}>
      <Text style={styles.text}>{isEnabled ? 'En ligne' : 'Hors-ligne'}</Text>
      <Switch
        style={styles.switch}
        trackColor={{ false: colors.white, true: colors.primary }}
        thumbColor={isEnabled ? colors.white : colors.grey3}
        ios_backgroundColor={colors.white}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  status: {
    marginRight: layout.spacer3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
    fontSize: font.fontSize1,
    fontWeight: '600',
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
    marginLeft: layout.spacer1,
  },
});
