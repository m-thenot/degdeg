import MapView, {
  PROVIDER_GOOGLE,
  MapViewProps,
  Marker,
  LatLng,
} from 'react-native-maps';
import {
  INITIAL_LONGITUDE,
  INITIAL_LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '@dagdag/common/constants';
import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import DepIcon from '../assets/icons/ic_dest.svg';
import ArrIcon from '../assets/icons/ic_dropoff.svg';

import { colors, layout } from '@dagdag/common/theme';
import { IMetadataRoute } from '../types';

interface IMap extends MapViewProps {
  apiKey: string;
  location?: LatLng;
  customStyle?: StyleProp<ViewStyle>;
  destination?: LatLng | string;
  origin?: LatLng | string;
  departureCoordinates?: LatLng;
  arrivalCoordinates?: LatLng;
  onReady?: (metadataRoute: IMetadataRoute) => void;
  withRoute?: boolean;
}

export const Map: React.FC<IMap> = React.memo(
  ({
    children,
    location,
    customStyle,
    destination,
    origin,
    departureCoordinates,
    arrivalCoordinates,
    onReady = () => 0,
    apiKey,
    withRoute = false,
    ...props
  }) => {
    const styles = createStyles();
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
      if (departureCoordinates && arrivalCoordinates && mapRef.current) {
        const startStopCoords = [departureCoordinates, arrivalCoordinates];
        mapRef.current.fitToCoordinates(startStopCoords, {
          edgePadding: {
            top: 30,
            left: 50,
            right: 50,
            bottom: 30,
          },
          animated: false,
        });
      } else if (location && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          100,
        );
      }
    }, [departureCoordinates, arrivalCoordinates, mapRef, location]);

    return (
      <MapView
        ref={mapRef}
        style={[styles.map, customStyle]}
        initialRegion={{
          latitude: INITIAL_LATITUDE,
          longitude: INITIAL_LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        provider={PROVIDER_GOOGLE}
        mapPadding={{ top: 20, right: 20, bottom: 20, left: 20 }}
        {...props}>
        <>
          {withRoute && destination && origin && (
            <MapViewDirections
              destination={destination}
              origin={origin}
              apikey={apiKey}
              strokeWidth={3}
              strokeColor={colors.black}
              onReady={onReady}
            />
          )}

          {departureCoordinates && arrivalCoordinates && (
            <>
              <Marker
                identifier="marker_departure"
                coordinate={departureCoordinates}>
                <DepIcon width={24} height={41} />
              </Marker>
              <Marker
                identifier="marker_arrival"
                coordinate={arrivalCoordinates}>
                <ArrIcon width={40} height={33} />
              </Marker>
            </>
          )}
        </>
      </MapView>
    );
  },
);

const createStyles = () => {
  return StyleSheet.create({
    map: {
      flex: 1,
      paddingHorizontal: layout.marginHorizontal,
    },
  });
};
