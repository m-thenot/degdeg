import CustomBottomSheet from '@components/CustomBottomSheet';
import { Button } from '@dagdag/common/components';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import Car from './Car';
import { useRecoilState, useRecoilValue } from 'recoil';
import { carState } from '@stores/car.atom';
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
import { OrderStatus, RideType, CarType } from '@dagdag/common/types';
import { createOrder } from '@services/order';
import { getFormateDate } from '@dagdag/common/utils';
import { useOrder } from '@context/order';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import { CREDIT_CARDS } from '@resources/images';
import { PAYMENT_TYPE } from '@internalTypes/user';
import CashIcon from '@dagdag/common/assets/icons/cash.svg';
import PaymentMethodsModal from './PaymentMethodsModal';

const snapPoints = [420, '80%'];

const CarsImages = {
  economic: require('@assets/images/standard.png'),
  premium: require('@assets/images/exec.png'),
  van: require('@assets/images/van.png'),
};

const Cars: React.FC<NativeStackScreenProps<BookingStackParamList, 'cars'>> = ({
  navigation,
}) => {
  const selectedCar = useRecoilValue(carState);
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
    setIsOrdering(true);

    // Check if user has a default payment method
    if (!Boolean(user?.defaultPaymentMethod?.type)) {
      setIsPaymentModalOpened(true);
    } else {
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
        metadataRoute: metadataRoute!,
        car: selectedCar!,
        rideType: isOrderNow ? RideType.NOW : RideType.LATER,
        departureAt: departureAt?.getTime() || Date.now(),
        price: null, // TODO: add pricig
      };

      try {
        setIsLoading(true);
        const result = await createOrder(order);
        setOrderUid?.(result.orderUid);
        await analytics().logEvent('new_order');
        navigation.navigate('order' as any, { screen: 'ride' });
      } catch (e: any) {
        setIsLoading(false);
        console.error(e);
        crashlytics().recordError(e);
      }

      setIsOrdering(false);
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

      <CustomBottomSheet snapPoints={snapPoints}>
        <View style={styles.container}>
          <View style={styles.list}>
            <Car
              label="économique"
              type={CarType.ECONOMIC}
              description="Économique, rapide et fiable"
              image={CarsImages.economic}
              price={25}
            />
            <Car
              label="premium"
              type={CarType.PREMIUM}
              description="Voitures spacieuses et chauffeurs les mieux notés"
              image={CarsImages.premium}
              price={33}
            />
            <Car
              label="van"
              type={CarType.VAN}
              description="Véhicules haut de gamme jusqu'à 6 passagers"
              image={CarsImages.van}
              price={40}
            />
          </View>
          <View style={styles.bottom}>
            <View>
              <Text style={styles.timeLabel}>Temps de trajet estimé</Text>
              <Text style={styles.time}>
                {metadataRoute?.duration && Math.ceil(metadataRoute?.duration)}{' '}
                min
              </Text>
            </View>

            {user?.defaultPaymentMethod &&
              (user?.defaultPaymentMethod.type === PAYMENT_TYPE.CREDIT_CARD ? (
                <Pressable
                  style={styles.card}
                  onPress={() => setIsPaymentModalOpened(true)}>
                  <View style={styles.cardBrand}>
                    {CREDIT_CARDS[user?.defaultPaymentMethod.brand]}
                  </View>
                  <Text style={styles.cardNumber}>
                    **** {user?.defaultPaymentMethod.last4}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.card}
                  onPress={() => setIsPaymentModalOpened(true)}>
                  <CashIcon width={25} height={25} />
                  <Text style={styles.cash}>Espèces</Text>
                </Pressable>
              ))}
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
              disabled={!selectedCar}
              isLoading={isLoading}
            />
            <Button
              text={isOrderNow ? 'Plus tard' : 'Modifier'}
              type="secondary"
              textStyle={styles.textButton}
              onPress={() => navigation.navigate('selectDate')}
              style={[styles.button, styles.laterButton]}
              disabled={!selectedCar}
            />
          </View>
        </View>
      </CustomBottomSheet>
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
