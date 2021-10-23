import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import Map from '@components/Map';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { useLocation } from '@context/location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors } from '@dagdag/common/theme';
import RideRequest from './RideRequest';
import Status from './Status';
import BottomStatus from './BottomStatus';
import { useRecoilValue } from 'recoil';
import { isAvailableState } from '@stores/driver.atom';

const Home: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'home'>> = ({
  navigation,
}) => {
  const { location } = useLocation();
  const [order, setOrder] = useState<any>();
  const [hasRequests, setHasRequests] = useState(true);
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
      setOrder(remoteMessage.data);

      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Map showsUserLocation />
      {hasRequests && isAvailable ? <RideRequest /> : <BottomStatus />}
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
