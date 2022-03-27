import { border, colors, font, layout } from '@dagdag/common/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowIcon from '@dagdag/common/assets/icons/left-arrow.svg';
import { CREDIT_CARDS } from '@resources/images';
import { Modal } from '@dagdag/common/components';
import usePaymentMethods from '@hooks/usePaymentMethods';
import CashIcon from '@dagdag/common/assets/icons/cash.svg';
import { updateUser } from '@services/user';
import { PaymentMethod } from '@internalTypes/payment';
import { Logger } from '@utils/Logger';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PAYMENT_TYPE } from '@dagdag/common/types';

interface IPaymentMethodsModalProps {
  onClose: () => void;
}

const PaymentMethodsModal: React.FC<IPaymentMethodsModalProps> = ({
  onClose,
}) => {
  const { isLoading, paymentMethods, getPaymentMethods } = usePaymentMethods();
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      getPaymentMethods();
    }, []),
  );

  const onSelectCard = async (paymentMethod: PaymentMethod) => {
    try {
      await updateUser({
        defaultPaymentMethod: {
          type: PAYMENT_TYPE.CREDIT_CARD,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          id: paymentMethod.id,
        },
      });
      onClose();
    } catch (e) {
      Logger.error(e);
    }
  };

  const onSelectCash = async () => {
    try {
      await updateUser({
        defaultPaymentMethod: {
          type: PAYMENT_TYPE.CASH,
        },
      });
      onClose();
    } catch (e) {
      Logger.error(e);
    }
  };

  return (
    <Modal isCustom onPressOutside={onClose}>
      <Text style={styles.paymentTitle}>Sélectionner un moyen de paiement</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          {paymentMethods.map(paymentMethod => (
            <PaymentMethodWrapper
              onPress={() => onSelectCard(paymentMethod)}
              key={paymentMethod.id}>
              <View style={styles.type}>
                <View style={styles.cardBrand}>
                  {CREDIT_CARDS[paymentMethod.card.brand]}
                </View>
                <Text style={styles.cardNumber}>
                  **** {paymentMethod.card.last4}
                </Text>
              </View>
            </PaymentMethodWrapper>
          ))}
          <PaymentMethodWrapper onPress={onSelectCash}>
            <View style={styles.type}>
              <CashIcon width={25} height={25} />
              <Text style={styles.cash}>Espèces</Text>
            </View>
          </PaymentMethodWrapper>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('payment')}>
            <View style={styles.plusContainer}>
              <Text style={styles.plus}>+</Text>
            </View>
            <Text style={styles.addText}>Ajouter un moyen de paiement</Text>
          </TouchableOpacity>
        </>
      )}
    </Modal>
  );
};

const PaymentMethodWrapper: React.FC<{ onPress: () => void }> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.cardSelect} onPress={onPress}>
      {children}
      <ArrowIcon width={14} height={14} style={styles.rightArrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    transform: [{ scale: 0.6 }],
    marginLeft: -layout.spacer4,
    borderWidth: 1,
    borderColor: colors.grey1,
    padding: layout.spacer2,
  },
  cardNumber: {
    fontSize: font.fontSize1_5,
    color: colors.black,
  },
  type: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacer5,
    borderRadius: border.radius3,
    height: 55,
    shadowColor: colors.grey3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    backgroundColor: colors.white,
    marginBottom: layout.spacer2,
  },
  rightArrow: {
    transform: [{ rotateY: '180deg' }],
  },
  paymentTitle: {
    fontSize: font.fontSize3,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: layout.spacer5,
  },
  cash: {
    color: colors.black,
    fontSize: font.fontSize1_5,
    marginLeft: layout.spacer2,
  },
  plusContainer: {
    backgroundColor: colors.primary,
    width: 25,
    height: 25,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: colors.primary,
    fontSize: font.fontSize2,
    marginLeft: layout.spacer2,
  },
  plus: {
    fontSize: font.fontSize4,
    lineHeight: font.fontSize4,
    color: colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: layout.spacer2,
    marginTop: layout.spacer5,
    marginBottom: layout.spacer3,
  },
});

export default PaymentMethodsModal;
