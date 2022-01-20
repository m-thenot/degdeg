import {
  Button,
  ContactProfile,
  RoundBottom,
  RouteSummary,
} from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { acceptOrder } from '@services/order';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IRideDetailProps {
  order: IOrder;
  isPrebookRide?: boolean;
  onPressStart?: () => void;
  onAcceptRide?: () => void;
}

const RideDetail: React.FC<IRideDetailProps> = ({
  order,
  isPrebookRide = false,
  onPressStart = () => 0,
  onAcceptRide = () => 0,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useFirebaseAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <RoundBottom customStyle={{ bottom: insets.bottom }}>
      <View style={styles.top}>
        <ContactProfile
          firstName={order?.user.firstName}
          image={order?.user.image}
          rating={order?.user.rating?.overall}
        />
        <View>
          <Text style={styles.price}>{order?.car.price}€</Text>
          <Text style={styles.distance}>
            {Math.round(order?.metadataRoute.distance)} km
          </Text>
        </View>
      </View>
      <RouteSummary
        departureAddress={order?.departureAddress.formattedAddress}
        arrivalAddress={order?.arrivalAddress.formattedAddress}
        departureAt={order?.departureAt}
        style={styles.summary}
      />
      {order.status === OrderStatus.NEW || !isPrebookRide ? (
        <Button
          text="Accepter"
          isLoading={isLoading}
          onPress={() => {
            setIsLoading(true);
            const driver = user;
            delete driver?.displayName;
            delete driver?.email;
            delete driver?.tokens;
            delete driver?.lastName;
            acceptOrder(driver, order.uid);
            onAcceptRide();
          }}
        />
      ) : (
        <Button text="Commencer" onPress={onPressStart} />
      )}
    </RoundBottom>
  );
};

export default RideDetail;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerText: {
    marginLeft: layout.spacer2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    marginLeft: layout.spacer1,
    marginTop: layout.spacer1,
  },
  name: {
    fontSize: font.fontSize2,
    color: colors.black,
    fontWeight: '700',
  },
  price: {
    fontWeight: '700',
    fontSize: font.fontSize5,
    color: colors.black,
    marginBottom: layout.spacer1,
  },
  distance: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: font.fontSize2,
  },
  summary: {
    marginVertical: layout.spacer5,
  },
});
