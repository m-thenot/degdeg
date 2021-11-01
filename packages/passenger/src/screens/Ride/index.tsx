import { useOrder } from '@context/order';
import { CrossHeader, MenuHeader } from '@dagdag/common/components';
import { RideStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapWrapper from '@screens/Booking/Cars/MapWrapper';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackHandler } from '@dagdag/common/hooks';
import { OrderStatus } from '@dagdag/common/types';
import SearchForDriver from './SearchForDriver';
import WaitingDriver from './WaitingDriver';
import OnTrip from './OnTrip';
import TripEnded from './TripEnded';

const marginBottomMap = {
  [OrderStatus.NEW]: 220,
  [OrderStatus.ACCEPTED]: 90,
  [OrderStatus.ON_SPOT]: 90,
  [OrderStatus.IN_PROGRESS]: 120,
};

const Ride: React.FC<NativeStackScreenProps<RideStackParamList, 'ride'>> = ({
  navigation,
}) => {
  const { order } = useOrder();
  useBackHandler(() => {
    navigation.navigate('cancelOrder');
    return true;
  });
  const styles = createStyles(order ? marginBottomMap[order?.status] : 0);
  const isFinished = order?.status !== OrderStatus.FINISHED;

  useEffect(() => {
    navigation.setOptions({
      title: order?.status === OrderStatus.IN_PROGRESS ? 'EN CHEMIN' : '',
      headerTitleAlign: 'center',
      headerLeft: () =>
        isFinished ? (
          <MenuHeader navigation={navigation} />
        ) : (
          <CrossHeader onPress={() => navigation.navigate('cancelOrder')} />
        ),
    });
  }, []);

  const stateMachine = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <SearchForDriver />;
      case OrderStatus.ACCEPTED:
        return <WaitingDriver />;
      case OrderStatus.ON_SPOT:
        return <WaitingDriver />;
      case OrderStatus.IN_PROGRESS:
        return <OnTrip />;
      case OrderStatus.FINISHED:
        return <TripEnded />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFinished && <MapWrapper mapStyle={styles.map} />}
      {order && stateMachine(order?.status!)}
    </SafeAreaView>
  );
};

export default Ride;

const createStyles = (marginBottomMap: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      marginBottom: marginBottomMap,
    },
  });
