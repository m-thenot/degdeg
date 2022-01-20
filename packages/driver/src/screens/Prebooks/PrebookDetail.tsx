import RideDetail from '@components/RideDetail';
import { BackHeader } from '@dagdag/common/components';
import { IOrder } from '@dagdag/common/types';
import {
  PrebooksStackParamList,
  DrawerNavigatorParamList,
} from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { getOrder } from '@services/order';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import MapWithRoute from '@components/MapWithRoute';
import DGToast, { ToastTypes } from '@utils/toast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import { isOnlineState } from '@stores/driver.atom';

type PrebookDetailNavigationProps = CompositeScreenProps<
  DrawerScreenProps<DrawerNavigatorParamList, 'prebooks'>,
  StackScreenProps<PrebooksStackParamList, 'detail'>
>;

const PrebookDetail: React.FC<PrebookDetailNavigationProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const { orderId } = route?.params;
  const [order, setOrder] = useState<IOrder | null>(null);
  const currentOrder = useRecoilValue(currentOrderState);
  const setisOnline = useSetRecoilState(isOnlineState);

  const [orders, setOrders] = useRecoilState(ordersState);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Détail de la course"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useEffect(() => {
    const getPrebookOrder = async () => {
      const prebookOrder = await getOrder(orderId!);
      setOrder(prebookOrder);
    };
    getPrebookOrder();
  }, [orderId]);

  const onAcceptRide = () => {
    DGToast.show(ToastTypes.DG_SUCCESS, {
      message: 'Cette course a été réservé avec succès !',
    });
    navigation.navigate('list', { activeTab: 'my_rides' });
  };

  const onPressStart = () => {
    setisOnline(true);
    if (!currentOrder || currentOrder.status === 'NEW') {
      const newOrders = [...orders];
      newOrders.unshift(order!);
      setOrders(newOrders);
      navigation.popToTop();
      navigation.navigate('home');
    } else {
      //modal pour prevenir risque d'annuler course en cours
    }
  };

  //TODO: modal cette course n'est plus disponible
  // Oups... trop tard, cette course a été prise en charge par un autre chauffeur.

  return (
    <SafeAreaView style={styles.container}>
      <MapWithRoute order={order} />
      {order && (
        <RideDetail
          order={order}
          onAcceptRide={onAcceptRide}
          isPrebookRide
          onPressStart={onPressStart}
        />
      )}
    </SafeAreaView>
  );
};

export default PrebookDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
