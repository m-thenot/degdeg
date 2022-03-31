import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, layout } from '@dagdag/common/theme';
import { BackHeader } from '@dagdag/common/components';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getUserOrders } from '@services/order';
import { IOrder } from '@dagdag/common/types';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';

const MyRides: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'myRides'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const { user } = useFirebaseAuthentication();

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
      {orders ? (
        <OrdersHistory orders={orders} isPassengerHistory />
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
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
    marginTop: -100,
  },
});
