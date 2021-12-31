import { Button, Modal, RoundBottom } from '@dagdag/common/components';
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import RouteIcon from '@assets/icons/route.svg';
import { colors, font, layout } from '@dagdag/common/theme';
import { updateOrderStatus } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';
import { useRecoilValue } from 'recoil';
import { currentOrderState } from '@stores/orders.atom';
import openMap from 'react-native-open-maps';
import { useLocation } from '@context/location';
import { getDistanceFromLatLonInKm } from '@utils/distance';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InProgress: React.FC = () => {
  const currentOrder = useRecoilValue(currentOrderState);
  const { location } = useLocation();
  const { arrivalAddress, departureAddress } = currentOrder!;
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const insets = useSafeAreaInsets();

  const updateStatus = () =>
    updateOrderStatus(OrderStatus.FINISHED, currentOrder!.uid);

  const onPressFinish = () => {
    if (
      getDistanceFromLatLonInKm(arrivalAddress.coordinates, location!) > 0.3
    ) {
      setIsConfirmationModalOpened(true);
    } else {
      updateStatus();
    }
  };

  return (
    <>
      <RoundBottom customStyle={{ bottom: insets.bottom }}>
        <Text style={styles.destination}>Aller à destination :</Text>
        <Text style={styles.address}>{arrivalAddress.formattedAddress}</Text>

        <Button
          text="Itinéraire"
          type="secondary"
          style={styles.routeButton}
          icon={<RouteIcon width={24} height={24} />}
          onPress={() =>
            openMap({
              travelType: 'drive',
              navigate: true,
              start: `${departureAddress.coordinates.latitude}, ${departureAddress.coordinates.longitude}`,
              end: `${arrivalAddress.coordinates!.latitude}, ${
                arrivalAddress.coordinates!.longitude
              }`,
            })
          }
        />
        <Button text="Terminer la course" onPress={onPressFinish} />
      </RoundBottom>
      {isConfirmationModalOpened && (
        <Modal
          question="Vous semblez encore loin de votre destination, êtes-vous sûr de vouloir terminer la course ?"
          primaryText="Oui"
          secondaryText="Non"
          onPressPrimary={() => updateStatus()}
          onPressSecondary={() => setIsConfirmationModalOpened(false)}
          onPressOutside={() => setIsConfirmationModalOpened(false)}
        />
      )}
    </>
  );
};

export default InProgress;

const styles = StyleSheet.create({
  address: {
    color: colors.black,
    fontSize: font.fontSize4,
  },
  destination: {
    color: colors.grey2,
    fontSize: font.fontSize2,
  },
  routeButton: {
    marginTop: layout.spacer5,
    marginBottom: layout.spacer3,
  },
});
