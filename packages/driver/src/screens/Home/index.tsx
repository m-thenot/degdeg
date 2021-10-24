import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors } from '@dagdag/common/theme';
import RideRequest from './RideRequest';
import Status from './Status';
import BottomStatus from './BottomStatus';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isAvailableState } from '@stores/driver.atom';
import { ordersState } from '@stores/orders.atom';
import MapWithRoute from './MapWithRoute';

const Home: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'home'>> = ({
  navigation,
}) => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const isAvailable = useRecoilValue(isAvailableState);

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
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const newOrder = remoteMessage?.data?.order;
      if (newOrder) {
        setOrders(orders => [...orders, JSON.parse(newOrder)]);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      Alert.alert(
        'Message handled in the background!',
        JSON.stringify(remoteMessage),
      );
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapWithRoute />
      {orders.length > 0 && isAvailable ? <RideRequest /> : <BottomStatus />}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
