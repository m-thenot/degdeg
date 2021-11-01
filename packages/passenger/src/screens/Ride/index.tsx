import { useOrder } from '@context/order';
import { CrossHeader } from '@dagdag/common/components';
import { RideStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapWrapper from '@screens/Booking/Cars/MapWrapper';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackHandler } from '@dagdag/common/hooks';
import { OrderStatus } from '@dagdag/common/types';
import SearchForDriver from './SearchForDriver';

const Ride: React.FC<NativeStackScreenProps<RideStackParamList, 'ride'>> = ({
  navigation,
}) => {
  const { order } = useOrder();
  useBackHandler(() => {
    navigation.navigate('cancelOrder');
    return true;
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CrossHeader onPress={() => navigation.navigate('cancelOrder')} />
      ),
    });
  }, []);

  const stateMachine = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <SearchForDriver />;
      case OrderStatus.ACCEPTED:
        return null;
      case OrderStatus.ON_SPOT:
        return null;
      case OrderStatus.IN_PROGRESS:
        return null;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapWrapper mapStyle={styles.map} />
      {order && stateMachine(order?.status!)}
    </SafeAreaView>
  );
};

export default Ride;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    marginBottom: 220,
  },
});
