import { Button, Modal } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { ordersState } from '@stores/orders.atom';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';

const CancelByCustomer: React.FC = () => {
  const [orders, setOrders] = useRecoilState(ordersState);

  const onPress = () => {
    const newOrders = [...orders];
    newOrders.shift();
    setOrders(newOrders);
  };

  return (
    <Modal isCustom>
      <Text style={styles.lateText}>
        Oups... le passager a finalement annulé la course.
      </Text>
      <Button text="Rechercher une nouvelle course" onPress={onPress} />
    </Modal>
  );
};

export default CancelByCustomer;

const styles = StyleSheet.create({
  lateText: {
    fontSize: font.fontSize2,
    color: colors.black,
    marginBottom: layout.spacer5,
  },
});
