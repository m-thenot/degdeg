import { Button, RoundBottom } from '@dagdag/common/components';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PhotoUser from '@assets/icons/photo-user.svg';
import Start from '@dagdag/common/assets/icons/star.svg';
import Cross from '@dagdag/common/assets/icons/white_cross.svg';
import { border, colors, font, layout } from '@dagdag/common/theme';
import { Circle, Svg, Line, Polygon } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  getFormattedTime,
  getFormattedTimeArrival,
} from '@dagdag/common/utils';
import { useRecoilState } from 'recoil';
import { ordersState } from '@stores/orders.atom';
import { updateOrderStatus } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';

const RideRequest: React.FC = () => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [isLoading, setIsLoading] = useState(false);
  const orderRequest = orders[0];

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
      <RoundBottom>
        <View style={styles.top}>
          <View style={styles.customer}>
            <PhotoUser height={50} width={50} />
            <View style={styles.customerText}>
              <Text style={styles.name}>{orderRequest.user.firstName}</Text>
              <View style={styles.scoreContainer}>
                <Start height={13} width={13} />
                <Text style={styles.score}>4.8</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.price}>{orderRequest.car.price}€</Text>
            <Text style={styles.distance}>
              {Math.round(orderRequest.metadataRoute.distance)} km
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <View>
            <Text style={[styles.timeDeparture, styles.time]}>
              {getFormattedTime(new Date(orders[0].departureAt))}
            </Text>
            <Text style={styles.time}>
              {getFormattedTimeArrival(
                new Date(orders[0].departureAt),
                orderRequest.metadataRoute.duration,
              )}
            </Text>
          </View>
          <View style={styles.elements}>
            <Svg height="10" width="10">
              <Circle cx="4" cy="4" r="4" fill={colors.primary} />
            </Svg>
            <Svg style={styles.line} height="49" width="3">
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2="49"
                stroke={colors.grey3}
                strokeWidth="3"
              />
            </Svg>
            <Svg height="8" width="10">
              <Polygon points="0,0 10,0 4,8" fill={colors.grey3} />
            </Svg>
          </View>
          <View style={styles.addresses}>
            <Text style={styles.departureAddress}>
              {orderRequest.departureAddress.formattedAddress}
            </Text>
            <Text> {orderRequest.arrivalAddress.formattedAddress}</Text>
          </View>
        </View>
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
  elements: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: layout.spacer3,
  },
  line: {
    marginVertical: layout.spacer2,
  },
  middle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: layout.spacer5,
    marginLeft: layout.spacer2,
  },
  addresses: {
    justifyContent: 'space-between',
    flexShrink: 1,
    width: '100%',
  },
  departureAddress: {
    marginBottom: 45,
  },
  timeDeparture: {
    marginBottom: 50,
  },
  time: {
    color: colors.grey3,
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
