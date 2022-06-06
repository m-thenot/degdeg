import React, { useEffect, useState } from 'react';
import {
  arrivalAddressState,
  departureAddressState,
} from '@stores/address.atom';
import { GOOGLE_MAPS_API_KEY } from '@constants/maps';
import { metadataRouteState } from '@stores/route.atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { StyleProp, ViewStyle } from 'react-native';
import { Map } from '@dagdag/common/components';
import { IMetadataRoute } from '@dagdag/common/types';

interface IMapWrapperProps {
  mapStyle?: StyleProp<ViewStyle>;
}

/* This wrapper is needed to prevent MAP to re-render (and lost the route) each time user select an other vehicle.*/

const MapWrapper: React.FC<IMapWrapperProps> = React.memo(({ mapStyle }) => {
  const setMetadaRouteState = useSetRecoilState(metadataRouteState);
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

      setMetadaRouteState({
        duration,
        distance,
        coordinates: startStopCoords,
      });
    }
  }, [metadataRoute?.coordinates]);

  return (
    <Map
      apiKey={GOOGLE_MAPS_API_KEY}
      customStyle={mapStyle}
      showsUserLocation
      withRoute={arrivalAddress.isSelected && departureAddress.isSelected}
      destination={arrivalAddress.coordinates || arrivalAddress.text}
      origin={departureAddress.coordinates || departureAddress.text}
      onReady={metadata => setMetadaRoute(metadata)}
      departureCoordinates={metadataRoute?.coordinates[0]}
      arrivalCoordinates={
        metadataRoute?.coordinates[metadataRoute?.coordinates.length - 1]
      }
    />
  );
});

export default MapWrapper;
