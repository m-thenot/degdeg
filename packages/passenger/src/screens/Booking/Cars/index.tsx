import CustomBottomSheet from '@components/CustomBottomSheet';
import { Button } from '@dagdag/common/components';
import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
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

const snapPoints = [400, '80%'];

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

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <BackHeader
          navigation={navigation}
          hasMargin={true}
          onPress={() => {
            setArrivalAddress(defaultAddress);
            navigation.goBack();
          }}
        />
      ),
    });
    return () => setDepartureAt(undefined);
  }, [navigation]);

  const handleOrder = () => {
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
      },
      metadataRoute: metadataRoute!,
      car: selectedCar!,
      rideType: isOrderNow ? RideType.NOW : RideType.LATER,
      departureAt: departureAt || new Date(),
      price: null, // TODO: add pricig
    };

    createOrder(order);
  };

  return (
    <>
      <MapWrapper />

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
          <Text style={styles.timeLabel}>Temps de trajet estimé</Text>
          <Text style={styles.time}>
            {metadataRoute?.duration && Math.ceil(metadataRoute?.duration)} min
          </Text>
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
    </>
  );
};

export default Cars;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.spacer5,
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
});
