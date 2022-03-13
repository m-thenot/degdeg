import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, font, layout } from '@dagdag/common/theme';
import { useStripe } from '@stripe/stripe-react-native';
import { fetchSetupIntentClientSecret } from '@services/checkout';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { updateUser } from '@services/user';
import { BackHeader, Button } from '@dagdag/common/components';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import DGToast, { ToastTypes } from '@utils/toast';
import { CREDIT_CARDS } from '@resources/images';
import usePaymentMethods from '@hooks/usePaymentMethods';

const Payment: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'payment'>
> = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useFirebaseAuthentication();
  const customer = {
    customerId: user?.customerId,
    email: user?.email,
    name: user?.firstName + ' ' + user?.lastName,
    phoneNumber: user?.phoneNumber,
  };
  const { isLoading, paymentMethods, getPaymentMethods } = usePaymentMethods();

  const insets = useSafeAreaInsets();

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
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Moyens de paiement"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });

    if (user?.customerId) {
      getPaymentMethods();
    }
    initializePaymentSheet();
  }, [user?.customerId]);

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
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <>
          {paymentMethods.map(paymentMethod => (
            <View
              key={paymentMethod.card.fingerprint}
              style={styles.creditCard}>
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
          {paymentMethods.length === 0 && (
            <Text style={styles.noCards}>
              Aucun moyen de paiement n'a été ajouté pour le moment.
            </Text>
          )}
        </>
      )}

      <View style={{ flex: 1 }} />
      <Button
        text="Ajouter un moyen de paiement"
        style={styles.button}
        onPress={openPaymentSheet}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
    backgroundColor: colors.white,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
  },
  noCards: {
    color: colors.black,
    fontSize: font.fontSize2,
    textAlign: 'center',
    flex: 1,
    paddingTop: '50%',
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
  button: {
    marginBottom: layout.spacer3,
  },
});
