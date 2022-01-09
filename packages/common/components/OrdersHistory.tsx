import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { border, colors, font, layout } from '../theme';
import { IOrder, OrderStatus } from '../types';
import { getCompleteDateFormatted } from '../utils';
import { RouteSummary } from './RouteSummary';

interface IOrdersHistoryProps {
  orders: IOrder[];
  isPassengerHistory?: boolean;
}

const OrdersHistory: React.FC<IOrdersHistoryProps> = ({
  orders,
  isPassengerHistory = false,
}) => {
  const styles = createStyles();
  const sortOrders = orders.sort((a, b) => {
    if (a.departureAt < b.departureAt) {
      return 1;
    } else if (a.departureAt > b.departureAt) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <ScrollView style={styles.jobs}>
      {sortOrders.map(order => (
        <View style={styles.job} key={order.uid}>
          <View style={styles.info}>
            {isPassengerHistory ? (
              <Text style={styles.createdDate}>
                {getCompleteDateFormatted(order.departureAt)}
              </Text>
            ) : (
              <Text style={styles.distance}>
                {Math.floor(order.metadataRoute.distance)} km
              </Text>
            )}

            <Text style={styles.price}>
              {order.status === OrderStatus.FINISHED ? (
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
        </View>
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
