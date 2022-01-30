import { Button, Modal } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IOrderAlreadyTakenModalProps {
  onClose: () => void;
  closeText?: string;
}

const OrderAlreadyTakenModal: React.FC<IOrderAlreadyTakenModalProps> = ({
  onClose,
  closeText = 'Fermer',
}) => {
  return (
    <Modal isCustom>
      <Text style={styles.lateText}>
        Oups... trop tard, cette course a été prise en charge par un autre
        chauffeur.
      </Text>
      <Button text={closeText} onPress={onClose} />
    </Modal>
  );
};

export default OrderAlreadyTakenModal;

const styles = StyleSheet.create({
  lateText: {
    fontSize: font.fontSize2,
    color: colors.black,
    textAlign: 'center',
    marginBottom: layout.spacer5,
  },
});
