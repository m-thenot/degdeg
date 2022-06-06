import { MyRidesStackParamList } from '@internalTypes/navigation';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  BackHeader,
  ContactProfile,
  Loader,
  Map,
  RouteSummary,
} from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
import { IOrder, PAYMENT_TYPE } from '@dagdag/common/types';
import { getOrder } from '@dagdag/common/services';
import { GOOGLE_MAPS_API_KEY } from '@constants/maps';
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '@dagdag/common/constants';
import ArrowIcon from '@dagdag/common/assets/icons/left-arrow.svg';
import { StackScreenProps } from '@react-navigation/stack';

const paymentType = {
  [PAYMENT_TYPE.CASH]: 'Espèces',
  [PAYMENT_TYPE.CREDIT_CARD]: 'Carte bancaire',
  [PAYMENT_TYPE.D_MONEY]: 'D-Money',
};

const RideDetails: React.FC<
  StackScreenProps<MyRidesStackParamList, 'rideDetails'>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { orderId } = route?.params;
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Détail de la course"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useEffect(() => {
    const getFullOrder = async () => {
      const prebookOrder = await getOrder(orderId!);
      setOrder(prebookOrder);
    };
    getFullOrder();
  }, [orderId]);

  if (!order) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Map
        apiKey={GOOGLE_MAPS_API_KEY}
        showsUserLocation={false}
        region={{
          latitude: order.departureAddress.coordinates.latitude!,
          longitude: order.departureAddress.coordinates.longitude!,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        origin={order.departureAddress.coordinates}
        destination={order.arrivalAddress.coordinates}
        departureCoordinates={order.departureAddress.coordinates}
        arrivalCoordinates={order.arrivalAddress.coordinates}
        withRoute
        customStyle={styles.map}
      />
      <View style={styles.content}>
        <RouteSummary
          departureAddress={order.departureAddress.formattedAddress}
          arrivalAddress={order.arrivalAddress.formattedAddress}
          departureAt={order.departureAt}
          style={styles.summary}
        />

        {order.driver && (
          <>
            <Text style={styles.title}>Chauffeur</Text>
            <Pressable
              style={styles.shadow}
              onPress={() =>
                navigation.navigate('driverDetails', {
                  driverId: order.driver!.uid,
                })
              }>
              <ContactProfile
                firstName={order.driver.firstName}
                image={order.driver.image}
                rating={order.driver.rating?.overall}
                car={order.driver.car?.brand + ' ' + order.driver.car?.model}
              />
              <ArrowIcon width={15} height={15} style={styles.arrow} />
            </Pressable>
          </>
        )}

        <Text style={styles.title}>Paiement</Text>
        <View style={styles.paiement}>
          <Text style={styles.text}>{paymentType[order.paymentType]}</Text>
          <Text style={styles.price}>{order?.price} DJF</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: layout.spacer5,
  },
  map: {
    maxHeight: 300,
  },
  content: {
    paddingHorizontal: layout.marginHorizontal,
  },
  summary: {
    marginTop: -layout.spacer5,
    zIndex: 2,
  },
  title: {
    fontSize: font.fontSize3,
    fontWeight: '700',
    marginTop: layout.spacer6,
  },
  shadow: {
    borderRadius: border.radius3,
    padding: layout.spacer3,
    marginTop: layout.spacer4,
    shadowColor: 'rgba(0,0,0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    transform: [{ rotateY: '180deg' }],
  },
  price: {
    fontSize: font.fontSize2,
    fontWeight: 'bold',
    color: colors.black,
  },
  text: {
    color: colors.black,
    fontSize: font.fontSize2,
  },
  paiement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grey4,
    marginTop: layout.spacer4,
    paddingHorizontal: layout.spacer3,
    paddingVertical: layout.spacer4,
    borderRadius: border.radius3,
  },
});
