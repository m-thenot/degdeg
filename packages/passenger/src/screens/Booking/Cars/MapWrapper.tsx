import React, { useEffect, useRef, useState } from 'react';
import {
  arrivalAddressState,
  departureAddressState,
} from '@stores/address.atom';
import Map from '@components/Map';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@constants/maps';
import { LatLng, Marker } from 'react-native-maps';
import DepIcon from '@assets/icons/ic_dest.svg';
import ArrIcon from '@assets/icons/ic_dropoff.svg';
import { metadataRouteState } from '@stores/route.atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { StyleSheet } from 'react-native';
import { colors } from '@dagdag/common/theme';

interface IMetadataRoute {
  distance: number;
  duration: number;
  coordinates: LatLng[];
  fare: Object;
  waypointOrder: [[]];
}

/* This wrapper is needed to prevent MAP to re-render (and lost the route) each time user select an other vehicle.*/

const MapWrapper: React.FC = React.memo(() => {
  const setMetadaRouteState = useSetRecoilState(metadataRouteState);
  const mapRef = useRef<any | undefined>();
  const [metadataRoute, setMetadaRoute] = useState<IMetadataRoute>();
  const departureAddress = useRecoilValue(departureAddressState);
  const arrivalAddress = useRecoilValue(arrivalAddressState);

  useEffect(() => {
    if (metadataRoute?.coordinates) {
      const { coordinates, duration, distance } = metadataRoute;
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
        animated: true,
      });
      setMetadaRouteState({
        duration,
        distance,
        coordinates: startStopCoords,
      });
    }
  }, [metadataRoute?.coordinates]);
  return (
    <Map mapRef={mapRef} customStyle={styles.map}>
      <MapViewDirections
        destination={arrivalAddress.coordinates || arrivalAddress.text}
        origin={departureAddress.coordinates || departureAddress.text}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={3}
        strokeColor={colors.black}
        onReady={metadata => setMetadaRoute(metadata)}
      />

      {metadataRoute?.coordinates && (
        <>
          <Marker
            identifier="marker_departure"
            coordinate={metadataRoute?.coordinates[0]}>
            <DepIcon width={24} height={41} />
          </Marker>
          <Marker
            identifier="marker_arrival"
            coordinate={
              metadataRoute?.coordinates[metadataRoute?.coordinates.length - 1]
            }>
            <ArrIcon width={40} height={33} />
          </Marker>
        </>
      )}
    </Map>
  );
});

export default MapWrapper;

const styles = StyleSheet.create({
  map: {
    marginBottom: 360,
  },
});
