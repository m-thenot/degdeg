import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { MyRidesStackParamList } from '@internalTypes/navigation';
import { colors, font, layout } from '@dagdag/common/theme';
import { BackHeader, Tabs } from '@dagdag/common/components';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getUserOrders } from '@services/order';
import { IOrder } from '@dagdag/common/types';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';
import { StackScreenProps } from '@react-navigation/stack';

enum TABS {
  HISTORY = 'history',
  UPCOMING = 'upcoming',
}

const tabs = [
  {
    value: TABS.HISTORY,
    label: 'Historique',
  },
  {
    value: TABS.UPCOMING,
    label: 'À venir',
  },
];

const MyRides: React.FC<
  StackScreenProps<MyRidesStackParamList, 'innerMyRides'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const { user } = useFirebaseAuthentication();
  const [activeTab, setActiveTab] = useState<TABS | string>(TABS.HISTORY);

  const ordersToDisplay =
    activeTab === TABS.UPCOMING
      ? orders?.filter(order => order.departureAt > Date.now())
      : orders?.filter(order => order.departureAt < Date.now());

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Mes courses"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getUserOrders(user?.uid);
      setOrders(orders.map(order => order.data()) as IOrder[]);
    };

    getOrders();
  }, [user?.uid]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </View>

      {ordersToDisplay ? (
        ordersToDisplay.length > 0 ? (
          <OrdersHistory
            orders={ordersToDisplay}
            isPassengerHistory
            hasStatusDisplayed={activeTab === TABS.HISTORY}
            sortByMostRecent={activeTab === TABS.HISTORY}
            onPress={uid =>
              navigation.navigate('rideDetails', { orderId: uid })
            }
          />
        ) : (
          <View style={styles.noRidesContainer}>
            <Text style={styles.noRides}>
              {activeTab === TABS.HISTORY
                ? "Vous n'avez réservez aucune course pour le moment."
                : 'Vous n’avez aucune course planifiée.'}
            </Text>
          </View>
        )
      ) : (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      )}
    </SafeAreaView>
  );
};

export default MyRides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: layout.spacer8,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
    marginTop: -100,
  },
  tabs: {
    marginHorizontal: layout.marginHorizontal,
    paddingBottom: layout.spacer2,
  },
  noRides: {
    textAlign: 'center',
    fontSize: font.fontSize2,
    color: colors.black,
  },
  noRidesContainer: {
    justifyContent: 'center',
    paddingHorizontal: layout.marginHorizontal,
    flex: 0.8,
  },
});
