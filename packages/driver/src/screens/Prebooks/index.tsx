import {
  DrawerNavigatorParamList,
  PrebooksStackParamList,
} from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { CrossHeaderWithLabel, Tabs } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { getMyPrebookOrders, getPrebookOrders } from '@services/order';
import { IOrder } from '@dagdag/common/types';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';

enum TABS {
  ALL = 'all',
  MY_RIDES = 'my_rides',
}

const tabs = [
  {
    value: TABS.ALL,
    label: 'Tout',
  },
  {
    value: TABS.MY_RIDES,
    label: 'Mes courses',
  },
];

type PrebookslNavigationProps = CompositeScreenProps<
  DrawerScreenProps<DrawerNavigatorParamList, 'prebooks'>,
  StackScreenProps<PrebooksStackParamList, 'list'>
>;

const Prebooks: React.FC<PrebookslNavigationProps> = ({
  navigation,
  route,
}) => {
  const { user } = useFirebaseAuthentication();
  const [activeTab, setActiveTab] = useState<TABS | string>(
    route?.params?.activeTab || TABS.ALL,
  );
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveTab(route?.params?.activeTab || TABS.ALL);
  }, [route?.params?.activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      const getOrders = async () => {
        setIsLoading(true);
        const orders =
          activeTab === TABS.ALL
            ? await getPrebookOrders()
            : await getMyPrebookOrders(user?.uid);
        setOrders(orders.map(order => order.data()) as IOrder[]);
        orders && setIsLoading(false);
      };

      getOrders();
    }, [activeTab]),
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <CrossHeaderWithLabel
        navigation={navigation}
        title="Réservations"
        hasPaddingHorizontal
      />
      <Tabs
        activeTab={activeTab}
        tabs={tabs}
        setActiveTab={setActiveTab}
        customStyle={styles.margin}
      />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : orders.length > 0 ? (
        <OrdersHistory
          orders={orders}
          hasPriceDisplayed
          hasDateDisplayed
          onPress={uid => navigation.navigate('detail', { orderId: uid })}
        />
      ) : (
        <View style={styles.noRidesContainer}>
          <Text style={styles.noRides}>
            {activeTab === TABS.ALL
              ? 'Aucune nouvelle course disponible pour le moment.'
              : "Vous n'avez aucune course planifiée pour le moment."}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Prebooks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: layout.spacer2,
  },
  margin: {
    marginHorizontal: layout.marginHorizontal,
  },
  loader: {
    flex: 0.8,
    alignSelf: 'center',
  },
  noRides: {
    textAlign: 'center',
    width: '90%',
    fontSize: font.fontSize2,
    color: colors.black,
  },
  noRidesContainer: {
    justifyContent: 'center',
    paddingHorizontal: layout.marginHorizontal,
    flex: 0.8,
  },
});
