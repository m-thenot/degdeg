import {
  DrawerNavigatorParamList,
  PrebooksStackParamList,
} from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { CrossHeaderWithLabel } from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
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

type PrebookslNavigationProps = CompositeScreenProps<
  DrawerScreenProps<DrawerNavigatorParamList, 'prebooks'>,
  StackScreenProps<PrebooksStackParamList, 'list'>
>;

const Prebooks: React.FC<PrebookslNavigationProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useFirebaseAuthentication();
  const [activeTab, setActiveTab] = useState<TABS | string>(
    route?.params?.activeTab || TABS.ALL,
  );
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveTab(route?.params?.activeTab || TABS.ALL);
  }, [route?.params?.activeTab]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CrossHeaderWithLabel
          navigation={navigation}
          title="Réservations"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab(TABS.ALL)}
          style={[
            styles.tab,
            styles.tabLeft,
            activeTab === TABS.ALL && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.label,
              activeTab === TABS.ALL && styles.activeLabel,
            ]}>
            Tout
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab(TABS.MY_RIDES)}
          style={[
            styles.tab,
            styles.tabRight,
            activeTab === TABS.MY_RIDES && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.label,
              activeTab === TABS.MY_RIDES && styles.activeLabel,
            ]}>
            Mes courses
          </Text>
        </Pressable>
      </View>

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
    paddingTop: layout.spacer5,
    paddingHorizontal: layout.marginHorizontal,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: border.radius2,
  },
  tab: {
    width: '50%',
    paddingVertical: layout.spacer3,
  },
  tabLeft: {
    borderTopLeftRadius: border.radius2,
    borderBottomLeftRadius: border.radius2,
  },
  tabRight: {
    borderTopRightRadius: border.radius2,
    borderBottomRightRadius: border.radius2,
  },
  label: {
    textAlign: 'center',
    fontSize: font.fontSize1_5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  activeLabel: {
    color: colors.white,
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
    flex: 0.8,
  },
});
