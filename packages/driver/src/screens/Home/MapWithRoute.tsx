import React, { useEffect, useMemo, useRef, useState } from 'react';
import Map from '@components/Map';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Marker } from 'react-native-maps';
import DepIcon from '@assets/icons/ic_dest.svg';
import ArrIcon from '@assets/icons/ic_dropoff.svg';
import { useRecoilValue } from 'recoil';
import { StyleSheet } from 'react-native';
import { colors } from '@dagdag/common/theme';
import { currentOrderState } from '@stores/orders.atom';
import { useLocation } from '@context/location';
import { IMetadataRoute, OrderStatus } from '@dagdag/common/types';
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '@dagdag/common/constants';

const marginBottomMap = {
  [OrderStatus.NEW]: 280,
  [OrderStatus.ACCEPTED]: 230,
};

const MapWithRoute: React.FC = React.memo(() => {
  const mapRef = useRef<any | undefined>();
  const order = useRecoilValue(currentOrderState);
  const styles = createStyles(
    order?.metadataRoute ? marginBottomMap[order.status] : 0,
  );

  const { location } = useLocation();
  const [metadataRoute, setMetadaRoute] = useState<IMetadataRoute>();

  useEffect(() => {
    if (metadataRoute?.coordinates) {
      const { coordinates } = metadataRoute;
      const startStopCoords = [
        coordinates[0],
        coordinates[coordinates.length - 1],
      ];
      mapRef?.current.fitToCoordinates(startStopCoords, {
        edgePadding: {
          top: 30,
          left: 50,
          right: 50,
          bottom: 30,
        },
        animated: false,
      });
    } else if (location) {
      mapRef?.current.animateToRegion(
        {
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        100,
      );
    }
  }, [metadataRoute?.coordinates, location]);

  return (
    <Map mapRef={mapRef} customStyle={styles.map}>
      {order?.metadataRoute && (
        <>
          <MapViewDirections
            destination={
              order.status === OrderStatus.ACCEPTED
                ? order?.departureAddress.coordinates
                : order?.arrivalAddress.coordinates
            }
            origin={
              order.status === OrderStatus.ACCEPTED
                ? location
                : order?.departureAddress.coordinates
            }
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor={colors.black}
            onReady={metadata => setMetadaRoute(metadata)}
          />

          <Marker
            identifier="marker_departure"
            coordinate={order.metadataRoute?.coordinates[0]}>
            <DepIcon width={24} height={41} />
          </Marker>
          <Marker
            identifier="marker_arrival"
            coordinate={
              order.metadataRoute?.coordinates[
                order.metadataRoute?.coordinates.length - 1
              ]
            }>
            <ArrIcon width={40} height={33} />
          </Marker>
        </>
      )}
    </Map>
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
