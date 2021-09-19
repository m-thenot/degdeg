import CustomBottomSheet from '@components/CustomBottomSheet';
import Button from '@components/Button';
import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Car from './Car';
import { CarType } from '@constants/car';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { carState } from '@stores/car.atom';
import { useNavigation } from '@react-navigation/core';
import { BackHeader } from '@navigation/HeaderLeft';
import { arrivalAddressState, defaultAddress } from '@stores/address.atom';
import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapWrapper from './MapWrapper';
import { metadataRouteState } from '@stores/route.atom';
import { colors, layout, font } from '@dagdag/common/theme';

const snapPoints = [400, '80%'];

const CarsImages = {
  economic: require('@assets/images/standard.png'),
  premium: require('@assets/images/exec.png'),
  van: require('@assets/images/van.png'),
};

const Cars: React.FC<NativeStackScreenProps<BookingStackParamList, 'cars'>> =
  () => {
    const selectedCar = useRecoilValue(carState);
    const navigation = useNavigation();
    const setArrivalAddress = useSetRecoilState(arrivalAddressState);
    const metadataRoute = useRecoilValue(metadataRouteState);

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
    }, [navigation]);

    return (
      <>
        <MapWrapper />

        <CustomBottomSheet snapPoints={snapPoints}>
          <View style={styles.container}>
            <View style={styles.list}>
              <Car
                label="économique"
                type={CarType.economic}
                description="Économique, rapide et fiable"
                image={CarsImages.economic}
                price={25}
              />
              <Car
                label="premium"
                type={CarType.premium}
                description="Voitures spacieuses et chauffeurs les mieux notés"
                image={CarsImages.premium}
                price={33}
              />
              <Car
                label="van"
                type={CarType.van}
                description="Véhicules haut de gamme jusqu'à 6 passagers"
                image={CarsImages.van}
                price={40}
              />
            </View>
            <Text style={styles.timeLabel}>Temps de trajet estimé</Text>
            <Text style={styles.time}>
              {metadataRoute?.duration && Math.ceil(metadataRoute?.duration)}{' '}
              min
            </Text>
            <View style={styles.buttons}>
              <Button
                text="Commander maintenant"
                onPress={() => console.log('Réserver !')}
                style={[styles.button, styles.nowButton]}
                textStyle={styles.textButton}
                disabled={!selectedCar}
              />
              <Button
                text="Plus tard"
                type="secondary"
                textStyle={styles.textButton}
                onPress={() => console.log('Réserver !')}
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
