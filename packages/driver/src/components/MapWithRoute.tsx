import React from 'react';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { StyleSheet } from 'react-native';
import { useLocation } from '@context/location';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import { Map } from '@dagdag/common/components';

const marginBottomMap = {
  [OrderStatus.NEW]: 280,
  [OrderStatus.ACCEPTED]: 230,
  [OrderStatus.ON_SPOT]: 230,
  [OrderStatus.IN_PROGRESS]: 230,
};

interface IMapWithRouteProps {
  order: IOrder | null;
}

const MapWithRoute: React.FC<IMapWithRouteProps> = React.memo(({ order }) => {
  const styles = createStyles(
    order?.metadataRoute ? marginBottomMap[order.status] : 0,
  );

  const { location } = useLocation();

  return (
    <Map
      location={location}
      apiKey={GOOGLE_MAPS_API_KEY}
      customStyle={styles.map}
      destination={
        order?.status === OrderStatus.ACCEPTED ||
        order?.status === OrderStatus.DRIVER_ON_THE_WAY
          ? order?.departureAddress.coordinates
          : order?.arrivalAddress.coordinates
      }
      origin={
        order?.status === OrderStatus.ACCEPTED ||
        order?.status === OrderStatus.DRIVER_ON_THE_WAY
          ? location
          : order?.departureAddress.coordinates
      }
      withRoute={Boolean(order?.metadataRoute)}
      departureCoordinates={order?.metadataRoute?.coordinates[0]}
      arrivalCoordinates={
        order?.metadataRoute?.coordinates[
          order.metadataRoute?.coordinates.length - 1
        ]
      }
      showsMyLocationButton={false}
      showsUserLocation
    />
  );
});

export default MapWithRoute;

const createStyles = (marginBottom: number) => {
  return StyleSheet.create({
    map: {
      marginBottom: marginBottom,
    },
  });
};
