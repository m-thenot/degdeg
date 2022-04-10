import { PAYMENT_TYPE } from '@dagdag/common/types';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { CREDIT_CARDS } from '@resources/images';
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import CashIcon from '@dagdag/common/assets/icons/cash.svg';
import { colors, font, layout } from '@dagdag/common/theme';

interface IDefaultPaymentMethodProps {
  onPress?: () => void;
}

const DefaultPaymentMethod: React.FC<IDefaultPaymentMethodProps> = ({
  onPress = () => 0,
}) => {
  const { user } = useFirebaseAuthentication();

  return (
    user?.defaultPaymentMethod &&
    (user?.defaultPaymentMethod.type === PAYMENT_TYPE.CREDIT_CARD ? (
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.cardBrand}>
          {CREDIT_CARDS[user?.defaultPaymentMethod.brand]}
        </View>
        <Text style={styles.cardNumber}>
          **** {user?.defaultPaymentMethod.last4}
        </Text>
      </Pressable>
    ) : (
      <Pressable style={styles.card} onPress={onPress}>
        <CashIcon width={25} height={25} />
        <Text style={styles.cash}>Espèces</Text>
      </Pressable>
    ))
  );
};

export default DefaultPaymentMethod;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    transform: [{ scale: 0.6 }],
    borderWidth: 1,
    borderColor: colors.grey1,
    padding: layout.spacer2,
  },
  cardNumber: {
    fontSize: font.fontSize1_5,
    color: colors.black,
  },
  cash: {
    color: colors.black,
    fontSize: font.fontSize1_5,
    marginLeft: layout.spacer2,
  },
});
