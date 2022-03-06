import CustomBottomSheet from '@components/CustomBottomSheet';
import { useOrder } from '@context/order';
import {
  Button,
  ContactProfile,
  RouteSummary,
} from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import CallIcon from '@dagdag/common/assets/icons/call.svg';
import { callNumber } from '@dagdag/common/utils';
import { OrderStatus } from '@dagdag/common/types';

const snapPoints = [200, 360];

const WaitingDriver: React.FC = () => {
  const { order } = useOrder();
  const { departureAddress, arrivalAddress, departureAt, driver } = order!;

  return (
    <>
      <View style={styles.top}>
        <View style={styles.circle} />
        <Text style={styles.status}>
          {order?.status === OrderStatus.ACCEPTED
            ? 'Votre chauffeur est en chemin...'
            : 'Votre chauffeur est arrivé.'}
        </Text>
      </View>
      <CustomBottomSheet style={styles.sheet} snapPoints={snapPoints}>
        <View style={styles.driver}>
          <ContactProfile firstName={driver?.firstName || ''} />
          <View style={styles.car}>
            <Text style={styles.licencePlate}>{driver?.car?.plate}</Text>
            <Text style={styles.model}>
              {driver?.car?.brand} {driver?.car?.model}
            </Text>
          </View>
        </View>

        <RouteSummary
          departureAddress={departureAddress.formattedAddress}
          arrivalAddress={arrivalAddress.formattedAddress}
          departureAt={departureAt}
        />
      </CustomBottomSheet>
      <View style={styles.buttonContainer}>
        <Button
          text="Appeler"
          onPress={() => callNumber(driver!.phoneNumber)}
          icon={<CallIcon width={18} height={18} fill={colors.white} />}
          style={styles.button}
        />
      </View>
    </>
  );
};

export default WaitingDriver;

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 70,
    width: Dimensions.get('screen').width - layout.spacer6,
    backgroundColor: colors.white,
    padding: layout.spacer3,
    borderRadius: border.radius4,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.grey3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginRight: layout.spacer2,
    marginLeft: layout.spacer1,
  },
  status: {
    color: colors.black,
    fontSize: font.fontSize2,
  },
  sheet: {
    paddingHorizontal: layout.spacer4,
  },
  driver: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  car: {
    alignItems: 'flex-end',
  },
  licencePlate: {
    fontWeight: 'bold',
    backgroundColor: colors.grey1,
    padding: layout.spacer1,
    borderRadius: border.radius2,
    marginBottom: 2,
  },
  model: {
    fontSize: font.fontSize1_5,
    color: colors.grey3,
    marginTop: 2,
  },
  buttonContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.spacer4,
  },
  button: {
    marginTop: layout.spacer6,
    marginBottom: layout.spacer3,
  },
});
