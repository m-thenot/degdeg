import { Button, RouteSummary } from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useOrder } from '@context/order';
import OkIcon from '@dagdag/common/assets/icons/ok.svg';
import Shape from '@assets/images/triangle-shape.svg';
import { useNavigation } from '@react-navigation/core';
import Rating from '@dagdag/common/components/Rating';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateRating } from '@dagdag/common/services';
import { Logger } from '@dagdag/common/utils';
import DefaultPaymentMethod from '@components/DefaultPaymentMethod';

const TripEnded: React.FC = () => {
  const { order } = useOrder();
  const { departureAddress, arrivalAddress, departureAt } = order!;
  const [isDriverRated, setIsDriverRated] = useState(false);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const onSubmit = () => {
    navigation.navigate('booking', { screen: 'home' });
  };

  const onSubmitRating = async (rating: number) => {
    try {
      await updateRating({
        rating,
        overallRating: order?.driver?.rating?.overall,
        ratingsCount: order?.driver?.rating?.count,
        uid: order?.driver?.uid!,
        isPassengerRating: false,
      });
    } catch (e: any) {
      Logger.error(e);
    }

    setIsDriverRated(true);
  };

  return !isDriverRated ? (
    <Rating
      text="Notez votre chauffeur"
      personToBeEvaluated={order?.driver!}
      onSubmit={onSubmitRating}
      style={{ bottom: insets.bottom }}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.invoice}>
        <View style={styles.invoiceContent}>
          <View style={styles.ok}>
            <OkIcon
              style={styles.icon}
              width={40}
              height={40}
              stroke={colors.primary}
            />
          </View>
          <Text style={styles.title}>Vous êtes arrivé à destination !</Text>
          <RouteSummary
            departureAddress={departureAddress.formattedAddress}
            arrivalAddress={arrivalAddress.formattedAddress}
            departureAt={departureAt}
          />
          <View style={styles.payment}>
            <DefaultPaymentMethod />
            <Text style={styles.price}>{order?.price} DJF</Text>
          </View>
        </View>
        <Shape style={styles.shape} width="100%" />
      </View>
      <Button text="Ok" onPress={onSubmit} style={styles.button} />
    </View>
  );
};

export default TripEnded;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey4,
    paddingHorizontal: layout.marginHorizontal,
    justifyContent: 'center',
  },
  invoice: {
    paddingTop: layout.spacer6,
    backgroundColor: colors.white,
    borderRadius: border.radius1,
    shadowColor: colors.grey3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  invoiceContent: {
    paddingHorizontal: layout.spacer3,
    alignItems: 'center',
  },
  ok: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.grey4,
    borderColor: colors.grey1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacer3,
  },
  icon: {
    zIndex: 40,
  },
  title: {
    fontSize: font.fontSize3,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: layout.marginHorizontal,
    width: '100%',
  },
  payment: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.grey4,
    width: '100%',
    padding: layout.spacer4,
    marginTop: layout.spacer3,
    borderRadius: border.radius3,
    marginBottom: layout.spacer6,
  },
  price: {
    fontSize: font.fontSize2,
    fontWeight: 'bold',
    color: colors.black,
  },
  shape: {
    marginBottom: -12,
  },
});
