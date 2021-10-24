import React, { useEffect, useRef } from 'react';
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

const MapWithRoute: React.FC = React.memo(() => {
  const mapRef = useRef<any | undefined>();
  const order = useRecoilValue(currentOrderState);
  const styles = createStyles(Boolean(order?.metadataRoute));

  const traceRoute = () => {
    if (order?.metadataRoute?.coordinates) {
      const { coordinates } = order?.metadataRoute;
      const startStopCoords = [
        coordinates[0],
        coordinates[coordinates.length - 1],
      ];
      mapRef?.current.fitToCoordinates(startStopCoords, {
        edgePadding: {
          top: 80,
          left: 50,
          right: 50,
          bottom: 80,
        },
        animated: true,
      });
    }
  };

  useEffect(() => {
    traceRoute();
  }, [order]);

  return (
    <Map mapRef={mapRef} customStyle={styles.map}>
      {order?.metadataRoute && (
        <>
          <MapViewDirections
            destination={order?.arrivalAddress.coordinates}
            origin={order?.departureAddress.coordinates}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor={colors.black}
            onReady={traceRoute}
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

const createStyles = (hasRoute: boolean) => {
  return StyleSheet.create({
    map: {
      marginBottom: hasRoute ? 280 : 0,
    },
  });
};
