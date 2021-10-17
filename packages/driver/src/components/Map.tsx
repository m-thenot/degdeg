import MapView, { PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {
  INITIAL_LONGITUDE,
  INITIAL_LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '@dagdag/common/constants';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { layout } from '@dagdag/common/theme';
import { useLocation } from '@context/location';
import { GOOGLE_MAPS_API_KEY } from '@env';

Geocoder.init(GOOGLE_MAPS_API_KEY, { language: 'fr' });

interface IMap extends MapViewProps {
  mapRef?: any;
  customStyle?: StyleProp<ViewStyle>;
}

const Map: React.FC<IMap> = React.memo(
  ({ children, mapRef = null, customStyle, region, ...props }) => {
    const { location } = useLocation();
    return (
      <MapView
        ref={mapRef}
        style={[styles.map, customStyle]}
        region={
          region || {
            latitude: location?.latitude || INITIAL_LATITUDE,
            longitude: location?.longitude || INITIAL_LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        }
        provider={PROVIDER_GOOGLE}
        mapPadding={{ top: 20, right: 20, bottom: 165, left: 20 }}
        {...props}>
        {children}
      </MapView>
    );
  },
);

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    paddingHorizontal: layout.marginHorizontal,
  },
});
