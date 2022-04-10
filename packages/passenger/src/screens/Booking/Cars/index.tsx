import { Button, RoundBottom } from '@dagdag/common/components';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Car from './Car';
import { useRecoilState, useRecoilValue } from 'recoil';
import { vehicleState } from '@stores/vehicle.atom';
import { BackHeader } from '@dagdag/common/components';
import {
  arrivalAddressState,
  defaultAddress,
  departureAddressState,
} from '@stores/address.atom';
import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapWrapper from './MapWrapper';
import { departureAtState, metadataRouteState } from '@stores/route.atom';
import { colors, layout, font } from '@dagdag/common/theme';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { OrderStatus, PAYMENT_TYPE, RideType } from '@dagdag/common/types';
import { createOrder } from '@services/order';
import { getFormateDate, Logger, sortByPrice } from '@dagdag/common/utils';
import { useOrder } from '@context/order';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';
import PaymentMethodsModal from './PaymentMethodsModal';
import { useVehicles } from '@context/vehicles';
import { proceedToPayment } from '@services/checkout';
import DGToast, { ToastTypes } from '@utils/toast';
import DefaultPaymentMethod from '@components/DefaultPaymentMethod';

//const snapPoints = [420, '80%'];

const Cars: React.FC<NativeStackScreenProps<BookingStackParamList, 'cars'>> = ({
  navigation,
}) => {
  const selectedVehicle = useRecoilValue(vehicleState);
  const { vehicles } = useVehicles();
  const [arrivalAddress, setArrivalAddress] =
    useRecoilState(arrivalAddressState);
  const metadataRoute = useRecoilValue(metadataRouteState);
  const departureAddress = useRecoilValue(departureAddressState);
  const [departureAt, setDepartureAt] = useRecoilState(departureAtState);
  const { user } = useFirebaseAuthentication();
  const isOrderNow = !departureAt;
  const { setOrderUid } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [isPaymentModalOpened, setIsPaymentModalOpened] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    return () => setDepartureAt(undefined);
  }, [navigation]);

  useEffect(() => {
    if (isOrdering && Boolean(user?.defaultPaymentMethod?.type)) {
      handleOrder();
    }
  }, [isOrdering, user?.defaultPaymentMethod]);

  const handleOrder = async () => {
    // Check if user has a default payment method
    if (!Boolean(user?.defaultPaymentMethod?.type)) {
      setIsOrdering(true);
      setIsPaymentModalOpened(true);
    } else {
      setIsOrdering(false);
      const price =
        selectedVehicle!.price.base +
        Math.ceil(metadataRoute?.duration || 1) *
          selectedVehicle!.price.perMinute;

      const order = {
        uid: '',
        createdDate: Date.now(),
        arrivalAddress: {
          formattedAddress: arrivalAddress.text,
          coordinates: metadataRoute!.coordinates[1],
        },
        departureAddress: {
          formattedAddress: departureAddress.text,
          coordinates: metadataRoute!.coordinates[0],
        },
        status: OrderStatus.NEW,
        user: {
          id: user!.uid,
          firstName: user?.firstName,
          phoneNumber: user?.phoneNumber,
          image: user?.image,
          rating: user?.rating,
        },
        paymentType: user?.defaultPaymentMethod?.type,
        metadataRoute: metadataRoute!,
        vehicle: selectedVehicle!,
        rideType: isOrderNow ? RideType.NOW : RideType.LATER,
        departureAt: departureAt?.getTime() || Date.now(),
        price: price,
      };

      const createOrderAndNavigate = async () => {
        try {
          const result = await createOrder(order);
          setOrderUid?.(result.orderUid);

          if (result.orderUid && order.rideType === RideType.NOW) {
            navigation.navigate('order' as any, { screen: 'ride' });
          } else if (result.orderUid) {
            navigation.navigate('prebookConfirmation');
          }
        } catch (e) {
          Logger.error(e + order.uid);
        }
        await analytics().logEvent('new_order');
      };

      try {
        setIsLoading(true);

        if (user?.defaultPaymentMethod?.type === PAYMENT_TYPE.CREDIT_CARD) {
          const data = await proceedToPayment(
            user.customerId,
            user.defaultPaymentMethod.id,
            Math.ceil(price / 2), // conversion to euro cents
          );
          if (data.success) {
            createOrderAndNavigate();
          }
        } else {
          createOrderAndNavigate();
        }
      } catch (e: any) {
        setIsLoading(false);
        Logger.error(e);

        if (e.message && e.message === 'PAYMENT_ERROR') {
          DGToast.show(
            ToastTypes.DG_ERROR,
            {
              message:
                'Impossible de procéder au paiement ! Essayer de changer de moyen de paiement ou contactez le support technique.',
            },
            15000,
          );
        } else {
          DGToast.show(
            ToastTypes.DG_ERROR,
            {
              message:
                "Une erreur innattendue s'est produite. Veuillez réessayer.",
            },
            5000,
          );
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <BackHeader
        navigation={navigation}
        backgroundColor="transparent"
        style={[styles.header, { top: insets.top }]}
        onPress={() => {
          setArrivalAddress(defaultAddress);
          navigation.goBack();
        }}
      />
      <MapWrapper mapStyle={styles.map} />

      <RoundBottom
        customStyle={{ bottom: insets.bottom, paddingBottom: layout.spacer5 }}>
        <View style={styles.list}>
          {vehicles.sort(sortByPrice).map(vehicle => {
            const price =
              vehicle.price.base +
              Math.ceil(metadataRoute?.duration || 1) * vehicle.price.perMinute;

            return <Car key={vehicle.type} vehicle={vehicle} price={price} />;
          })}
        </View>
        <View style={styles.bottom}>
          <View>
            <Text style={styles.timeLabel}>Temps de trajet estimé</Text>
            <Text style={styles.time}>
              {metadataRoute?.duration && Math.ceil(metadataRoute?.duration)}{' '}
              min
            </Text>
          </View>

          <DefaultPaymentMethod onPress={() => setIsPaymentModalOpened(true)} />
        </View>
        <View style={styles.buttons}>
          <Button
            text={
              isOrderNow
                ? 'Commander maintenant'
                : `Commander ${getFormateDate(departureAt)}`
            }
            onPress={handleOrder}
            style={[styles.button, styles.nowButton]}
            textStyle={styles.textButton}
            disabled={!selectedVehicle}
            isLoading={isLoading}
          />
          <Button
            text={isOrderNow ? 'Plus tard' : 'Modifier'}
            type="secondary"
            textStyle={styles.textButton}
            onPress={() => navigation.navigate('selectDate')}
            style={[styles.button, styles.laterButton]}
            disabled={!selectedVehicle}
          />
        </View>
      </RoundBottom>
      {isPaymentModalOpened && (
        <PaymentMethodsModal onClose={() => setIsPaymentModalOpened(false)} />
      )}
    </SafeAreaView>
  );
};

export default Cars;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    marginHorizontal: layout.spacer5,
  },
  header: {
    position: 'absolute',
    left: layout.marginHorizontal,
  },
  map: {
    marginBottom: 360,
  },
  timeLabel: {
    color: colors.grey2,
    fontSize: font.fontSize1,
  },
  time: {
    fontSize: font.fontSize1,
    color: colors.primary,
  },
  button: {
    marginTop: layout.spacer4,
  },
  nowButton: {
    flex: 1,
    marginRight: layout.spacer2,
    paddingHorizontal: layout.spacer3,
  },
  laterButton: {
    paddingHorizontal: layout.spacer2,
  },
  list: {
    marginTop: layout.spacer2,
    marginBottom: layout.spacer4,
  },
  buttons: {
    flexDirection: 'row',
  },
  textButton: {
    fontSize: font.fontSize2,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacer3,
  },
});
