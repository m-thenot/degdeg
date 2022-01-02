import {
  Button,
  ContactProfile,
  RoundBottom,
  RouteSummary,
} from '@dagdag/common/components';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Cross from '@dagdag/common/assets/icons/white_cross.svg';
import { border, colors, font, layout } from '@dagdag/common/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useRecoilState } from 'recoil';
import { ordersState } from '@stores/orders.atom';
import { updateOrderStatus } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RideRequest: React.FC = () => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [isLoading, setIsLoading] = useState(false);
  const orderRequest = orders[0];
  const insets = useSafeAreaInsets();

  const handlePressDecline = () => {
    const newOrders = [...orders];
    newOrders.shift();
    setOrders(newOrders);
  };

  return (
    <>
      <View style={styles.ignore}>
        <TouchableOpacity
          style={styles.ignoreButton}
          onPress={handlePressDecline}>
          <Cross width={11} height={11} />
          <Text style={styles.ignoreText}>Décliner</Text>
        </TouchableOpacity>
      </View>
      <RoundBottom customStyle={{ bottom: insets.bottom }}>
        <View style={styles.top}>
          <ContactProfile
            firstName={orderRequest.user.firstName}
            image={orderRequest.user.image}
            rating={orderRequest.user.rating?.overall}
          />
          <View>
            <Text style={styles.price}>{orderRequest.car.price}€</Text>
            <Text style={styles.distance}>
              {Math.round(orderRequest.metadataRoute.distance)} km
            </Text>
          </View>
        </View>
        <RouteSummary
          departureAddress={orderRequest.departureAddress.formattedAddress}
          arrivalAddress={orderRequest.arrivalAddress.formattedAddress}
          departureAt={orderRequest.departureAt}
          style={styles.summary}
        />
        <Button
          text="Accepter"
          isLoading={isLoading}
          onPress={() => {
            setIsLoading(true);
            updateOrderStatus(OrderStatus.ACCEPTED, orderRequest.uid);
          }}
        />
      </RoundBottom>
    </>
  );
};

export default RideRequest;

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
  ignore: {
    position: 'absolute',
    backgroundColor: colors.black,
    zIndex: 10,
    top: '20%',
    alignSelf: 'center',
    borderRadius: border.radius4,
  },
  ignoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacer2,
    paddingHorizontal: layout.spacer3,
  },
  ignoreText: {
    color: colors.white,
    fontSize: font.fontSize1_5,
    marginLeft: layout.spacer1,
    transform: [{ translateY: -0.6 }],
  },
});
