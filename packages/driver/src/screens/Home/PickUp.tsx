import { Button, RoundBottom } from '@dagdag/common/components';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import RouteIcon from '@assets/icons/route.svg';
import CallIcon from '@dagdag/common/assets/icons/call.svg';
import CloseIcon from '@dagdag/common/assets/icons/cross.svg';

import { colors, font, layout } from '@dagdag/common/theme';
import { RoundIconButton } from '@dagdag/common/components/RoundIconButton';
import { updateOrderStatus } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';
import { useRecoilValue } from 'recoil';
import { currentOrderState } from '@stores/orders.atom';
import openMap from 'react-native-open-maps';
import { useLocation } from '@context/location';
import { callNumber } from '@dagdag/common/utils';

const PickUp: React.FC = () => {
  const currentOrder = useRecoilValue(currentOrderState);
  const { location } = useLocation();

  return (
    <RoundBottom>
      <Text style={styles.pickup}>
        Récupérer {currentOrder?.user.firstName} à{' '}
      </Text>
      <Text style={styles.address}>
        {currentOrder?.departureAddress.formattedAddress}
      </Text>

      <View style={styles.actions}>
        <Button
          icon={<CallIcon width={18} height={18} />}
          text="Appeler"
          type="secondary"
          onPress={() => callNumber(currentOrder?.user.phoneNumber!)}
        />
        <Button
          text="Itinéraire"
          type="secondary"
          icon={<RouteIcon width={24} height={24} />}
          onPress={() =>
            openMap({
              travelType: 'drive',
              navigate: true,
              start: `${location?.latitude}, ${location?.longitude}`,
              end: `${currentOrder?.departureAddress.coordinates!.latitude}, ${
                currentOrder?.departureAddress.coordinates!.longitude
              }`,
            })
          }
        />
        <RoundIconButton
          onPress={() =>
            updateOrderStatus(OrderStatus.CANCELED_BY_DRIVER, currentOrder!.uid)
          }>
          <CloseIcon width={13} height={13} fill="red" stroke="red" />
        </RoundIconButton>
      </View>

      <Button text="Je suis arrivé" onPress={() => 0} />
    </RoundBottom>
  );
};

export default PickUp;

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: layout.spacer4,
  },
  address: {
    color: colors.black,
    fontSize: font.fontSize4,
  },
  pickup: {
    color: colors.grey2,
    fontSize: font.fontSize2,
  },
});
