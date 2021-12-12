import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, font, layout } from '@dagdag/common/theme';
import { useStripe } from '@stripe/stripe-react-native';
import {
  fetchPaymentMethods,
  fetchSetupIntentClientSecret,
} from '@services/checkout';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { updateUser } from '@services/user';
import { Button } from '@dagdag/common/components';
import { SafeAreaView } from 'react-native-safe-area-context';

// CREDIT CARDS ICONS
import AmexIcon from '@assets/images/amex.svg';
import VisaIcon from '@assets/images/visa.svg';
import MasterCardIcon from '@assets/images/mastercard.svg';
import UnionPayIcon from '@assets/images/union_pay.svg';
import CreditCardIcon from '@assets/images/credit_card.svg';
import DGToast, { ToastTypes } from '@utils/toast';
import { PaymentMethod } from '@internalTypes/payment';

const CREDIT_CARDS = {
  amex: <AmexIcon width={50} height={50} />,
  jcb: <CreditCardIcon width={50} height={35} />,
  mastercard: <MasterCardIcon width={50} height={18} />,
  visa: <VisaIcon width={50} height={18} />,
  unionpay: <UnionPayIcon width={50} height={35} />,
  unknown: <CreditCardIcon width={50} height={35} />,
  discover: <CreditCardIcon width={50} height={35} />,
  dinersclub: <CreditCardIcon width={50} height={35} />,
};

const Payment: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'payment'>
> = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useFirebaseAuthentication();
  const customer = {
    customerId: user?.customerId,
    email: user?.email,
    name: user?.firstName + ' ' + user?.lastName,
    phoneNumber: user?.phoneNumber,
  };
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const getPaymentMethods = async () => {
    const newPaymentMethods: { data: PaymentMethod[] } =
      await fetchPaymentMethods(user?.customerId);
    if (
      newPaymentMethods.data.length > 0 &&
      ((paymentMethods.length > 0 &&
        newPaymentMethods.data.length > paymentMethods.length) || // Make new payment method as default payment method
        !newPaymentMethods.data.find(
          paymentMethod => paymentMethod.id === user?.defaultPaymentMethod, // Change default payment method if it is not exist anymore
        ))
    ) {
      updateUser({ defaultPaymentMethod: newPaymentMethods.data[0].id });
    }
    setPaymentMethods(newPaymentMethods?.data || []);
  };

  const initializePaymentSheet = async () => {
    const {
      clientSecret,
      ephemeralKey,
      customerId: fetchedCustomerId,
    } = await fetchSetupIntentClientSecret(customer);

    if (!user?.customerId) {
      updateUser({ customerId: fetchedCustomerId });
    }

    await initPaymentSheet({
      customerId: fetchedCustomerId,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: clientSecret,
      defaultBillingDetails: {
        ...customer,
        address: {
          country: 'FR',
        },
      },
    });
  };

  useEffect(() => {
    if (user?.customerId) {
      getPaymentMethods();
    }
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code !== 'Canceled') {
        DGToast.show(ToastTypes.DG_ERROR, {
          message:
            "Une erreur innatendue s'est produite, veuillez rééessayer !",
        });
      }
    } else {
      getPaymentMethods();
      DGToast.show(ToastTypes.DG_SUCCESS, {
        message: 'Votre carte a été ajoutée avec succès !',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {paymentMethods.map(paymentMethod => (
        <View key={paymentMethod.card.fingerprint} style={styles.creditCard}>
          {CREDIT_CARDS[paymentMethod.card.brand]}
          <View style={styles.cardInfo}>
            <Text style={styles.last4}>
              **** **** **** {paymentMethod?.card?.last4}
            </Text>
            <Text style={styles.exp}>
              Expiration:{' '}
              {paymentMethod?.card?.exp_month > 9
                ? paymentMethod?.card?.exp_month
                : '0' + paymentMethod?.card?.exp_month}{' '}
              / {paymentMethod?.card?.exp_year}
            </Text>
          </View>
        </View>
      ))}
      <View style={{ flex: 1 }} />
      <Button text="Ajouter un moyen de paiement" onPress={openPaymentSheet} />
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
    marginTop: layout.spacer9,
  },
  creditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.spacer2,
    paddingBottom: layout.spacer5,
    borderColor: colors.grey1,
    borderBottomWidth: 1,
    marginBottom: layout.spacer5,
  },
  cardInfo: {
    marginLeft: layout.spacer5,
  },
  last4: {
    fontSize: font.fontSize2,
    color: colors.black,
  },
  exp: {
    marginTop: layout.spacer1,
    fontSize: font.fontSize1_5,
    color: colors.grey3,
  },
});
