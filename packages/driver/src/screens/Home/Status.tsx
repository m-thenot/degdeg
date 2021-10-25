import { Modal } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { OrderStatus } from '@dagdag/common/types';
import { Portal } from '@gorhom/portal';
import { updateOrderStatus } from '@services/order';
import { isAvailableState } from '@stores/driver.atom';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import React, { useEffect, useState } from 'react';
import { Switch, StyleSheet, View, Text } from 'react-native';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const Status: React.FC = () => {
  const [isAvailable, setIsAvailable] = useRecoilState(isAvailableState);
  const [isEnabled, setIsEnabled] = useState(isAvailable);
  const setOrders = useSetRecoilState(ordersState);
  const currentOrder = useRecoilValue(currentOrderState);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setIsAvailable(previousState => !previousState);
  };

  const onSwitchChange = () => {
    if (currentOrder && currentOrder.status !== OrderStatus.NEW) {
      setIsModalOpened(true);
    } else {
      toggleSwitch();
    }
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
    <>
      <View style={styles.status}>
        <Text style={styles.text}>{isEnabled ? 'En ligne' : 'Hors-ligne'}</Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: colors.white, true: colors.primary }}
          thumbColor={isEnabled ? colors.white : colors.grey3}
          ios_backgroundColor={colors.white}
          onValueChange={onSwitchChange}
          value={isEnabled}
        />
      </View>
      {isModalOpened && (
        <Portal>
          <Modal
            question="En vous mettant hors-ligne, vous annulerez la course en cours. Êtes-vous sûr de vouloir annuler cette course ?"
            primaryText="Oui"
            secondaryText="Non"
            onPressPrimary={() => {
              toggleSwitch();
              updateOrderStatus(
                OrderStatus.CANCELED_BY_DRIVER,
                currentOrder!.uid,
              );
              setIsModalOpened(false);
            }}
            onPressSecondary={() => setIsModalOpened(false)}
            onPressOutside={() => setIsModalOpened(false)}
          />
        </Portal>
      )}
    </>
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
