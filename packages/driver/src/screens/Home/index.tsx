import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { requestUserPermission, saveTokenToDatabase } from '@services/driver';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors } from '@dagdag/common/theme';
import RideRequest from './RideRequest';
import Status from './Status';
import BottomStatus from './BottomStatus';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isOnlineState } from '@stores/driver.atom';
import { ordersState, currentOrderState } from '@stores/orders.atom';
import MapWithRoute from '@components/MapWithRoute';
import { OrderStatus } from '@dagdag/common/types';
import PickUp from './PickUp';
import { CurrentOrderProvider } from '@context/currentOrder';
import OnSpot from './OnSpot';
import InProgress from './InProgress';
import Finished from './Finished';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import OrderAlreadyTakenModal from '@components/OrderAlreadyTakenModal';

const Home: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'home'>> = ({
  navigation,
}) => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const isOnline = useRecoilValue(isOnlineState);
  const currentOrder = useRecoilValue(currentOrderState);
  const { user } = useFirebaseAuthentication();
  const [orderIsNotAvailable, setOrderIsNotAvailable] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Status />,
    });
  }, [navigation]);

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    const takeOrder = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const newOrder = remoteMessage?.data?.order;
      if (newOrder) {
        setOrders(orders => [...orders, JSON.parse(newOrder)]);
      }
    };

    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      takeOrder(remoteMessage);
    });

    // works only on android
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (Platform.OS === 'android') {
        takeOrder(remoteMessage);
      }
    });

    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        if (Platform.OS === 'ios') {
          takeOrder(remoteMessage);
        }
      },
    );

    return () => {
      unsubscribeMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

  useEffect(() => {
    if (
      currentOrder?.status === OrderStatus.ACCEPTED &&
      currentOrder?.driver?.uid !== user?.uid
    ) {
      setOrderIsNotAvailable(true);
    }
  }, [currentOrder]);

  const handlePressDecline = () => {
    const newOrders = [...orders];
    newOrders.shift();
    setOrders(newOrders);
    setOrderIsNotAvailable(false);
  };

  const stateMachine = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <RideRequest />;
      case OrderStatus.ACCEPTED:
        return currentOrder?.driver?.uid === user?.uid ? (
          <PickUp />
        ) : (
          <RideRequest />
        );
      case OrderStatus.ON_SPOT:
        return <OnSpot />;
      case OrderStatus.IN_PROGRESS:
        return <InProgress />;
      case OrderStatus.FINISHED:
        return <Finished />;
      default:
        return null;
    }
  };

  return (
    <CurrentOrderProvider>
      <SafeAreaView style={styles.container}>
        <MapWithRoute order={currentOrder} />
        {orders.length > 0 && isOnline ? (
          stateMachine(currentOrder?.status!)
        ) : (
          <BottomStatus />
        )}
        {orderIsNotAvailable && (
          <OrderAlreadyTakenModal onClose={handlePressDecline} />
        )}
      </SafeAreaView>
    </CurrentOrderProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
