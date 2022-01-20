import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { border, colors, font, layout } from '../theme';
import { IOrder, OrderStatus } from '../types';
import { getFormateDate, sortByDepartureAtDesc } from '../utils';
import { RouteSummary } from './RouteSummary';

interface IOrdersHistoryProps {
  orders: IOrder[];
  isPassengerHistory?: boolean;
  hasPriceDisplayed?: boolean;
  hasDateDisplayed?: boolean;
  onPress?: (uid: string) => void;
}

const OrdersHistory: React.FC<IOrdersHistoryProps> = ({
  orders,
  isPassengerHistory = false,
  hasPriceDisplayed = false,
  hasDateDisplayed = false,
  onPress,
}) => {
  const styles = createStyles();
  const sortOrders = orders.sort(sortByDepartureAtDesc);

  return (
    <ScrollView style={styles.jobs}>
      {sortOrders.map(order => (
        <TouchableOpacity
          style={styles.job}
          key={order.uid}
          onPress={() => onPress && onPress(order?.uid)}
          activeOpacity={onPress ? 0.6 : 1}>
          <View style={styles.info}>
            {(isPassengerHistory || hasDateDisplayed) && (
              <Text style={styles.createdDate}>
                {getFormateDate(order.departureAt, true)}
              </Text>
            )}

            {!isPassengerHistory && (
              <Text style={styles.distance}>
                {Math.floor(order.metadataRoute.distance)} km
              </Text>
            )}

            <Text style={styles.price}>
              {order.status === OrderStatus.FINISHED || hasPriceDisplayed ? (
                `${order.price} €`
              ) : order.status.startsWith('CANCEL') ? (
                <Text style={styles.canceled}>ANNULÉ</Text>
              ) : (
                <Text style={styles.inprogress}>EN COURS</Text>
              )}
            </Text>
          </View>
          <View style={styles.separator} />
          <RouteSummary
            departureAddress={order.departureAddress.formattedAddress}
            arrivalAddress={order.arrivalAddress.formattedAddress}
            departureAt={order.departureAt}
            style={styles.summary}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default OrdersHistory;

const createStyles = () => {
  return StyleSheet.create({
    summary: {
      borderWidth: 0,
      padding: 0,
    },
    info: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: layout.spacer3,
    },
    separator: {
      height: 1,
      width: '100%',
      backgroundColor: colors.grey1,
    },
    job: {
      marginTop: layout.spacer4,
      padding: layout.spacer4,
      backgroundColor: colors.white,
      borderRadius: border.radius4,
      shadowColor: colors.grey3,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      zIndex: 999,
    },
    distance: {
      color: colors.black,
      fontSize: font.fontSize2,
    },
    price: {
      color: colors.black,
      fontSize: font.fontSize2,
      fontWeight: 'bold',
    },
    jobs: {
      paddingHorizontal: layout.spacer2,
    },
    canceled: {
      color: colors.error,
      fontSize: font.fontSize1_5,
    },
    inprogress: {
      color: colors.primary,
      fontSize: font.fontSize1_5,
    },
    createdDate: {
      color: colors.black,
      fontSize: font.fontSize1_5,
      fontWeight: 'bold',
    },
  });
};
