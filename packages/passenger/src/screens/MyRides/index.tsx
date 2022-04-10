import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, layout } from '@dagdag/common/theme';
import { BackHeader, Tabs } from '@dagdag/common/components';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getUserOrders } from '@services/order';
import { IOrder } from '@dagdag/common/types';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';

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
  DrawerScreenProps<DrawerNavigatorParamList, 'myRides'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const { user } = useFirebaseAuthentication();
  const [activeTab, setActiveTab] = useState<TABS | string>(TABS.HISTORY);

  const ollOrders =
    orders?.filter(order => order.departureAt < Date.now()) || [];
  const upcomingOrders =
    orders?.filter(order => order.departureAt > Date.now()) || [];

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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </View>
      {orders ? (
        <OrdersHistory
          orders={activeTab === TABS.UPCOMING ? upcomingOrders : ollOrders}
          isPassengerHistory
          hasStatusDisplayed={activeTab === TABS.HISTORY}
          sortByMostRecent={activeTab === TABS.HISTORY}
        />
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
});
