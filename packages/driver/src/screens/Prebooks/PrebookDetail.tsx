import RideDetail from '@screens/Prebooks/RideDetail';
import { BackHeader, Modal } from '@dagdag/common/components';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import {
  PrebooksStackParamList,
  DrawerNavigatorParamList,
} from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { getOrder, updateOrderStatus } from '@services/order';
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
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { colors, font } from '@dagdag/common/theme';
import OrderAlreadyTakenModal from '@components/OrderAlreadyTakenModal';

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
  const [isCancelModalOpened, setIsCancelModalOpened] = useState(false);
  const [orders, setOrders] = useRecoilState(ordersState);
  const { user } = useFirebaseAuthentication();

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

  const takeOrder = () => {
    const newOrders = [...orders];
    newOrders.unshift(order!);
    setOrders(newOrders);
    navigation.popToTop();
    navigation.navigate('home');
  };

  const onPressStart = () => {
    setisOnline(true);
    if (!currentOrder || currentOrder.status === 'NEW') {
      takeOrder();
    } else {
      setIsCancelModalOpened(true);
    }
  };

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

      {isCancelModalOpened && (
        <Modal
          question="Vous êtes déjà engagé dans une course. Êtes-vous sûr de vouloir annuler cette course ?"
          primaryText="Oui"
          secondaryText="Non"
          onPressPrimary={() => {
            updateOrderStatus(
              OrderStatus.CANCELED_BY_DRIVER,
              currentOrder!.uid,
            );
            takeOrder();
          }}
          onPressSecondary={() => setIsCancelModalOpened(false)}
          onPressOutside={() => setIsCancelModalOpened(false)}
        />
      )}

      {order?.status === OrderStatus.ACCEPTED &&
        order.driver?.uid !== user?.uid && (
          <OrderAlreadyTakenModal
            onClose={() => navigation.goBack()}
            closeText="Retour"
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
  lateText: {
    fontSize: font.fontSize2,
    color: colors.black,
    textAlign: 'center',
  },
});
