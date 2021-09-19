import MapView, { PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {
  GOOGLE_MAPS_API_KEY,
  INITIAL_LONGITUDE,
  INITIAL_LATITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '@constants/maps';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useRecoilValue } from 'recoil';
import { currentPositionState } from '@stores/address.atom';
import { layout } from '@dagdag/common/theme';

Geocoder.init(GOOGLE_MAPS_API_KEY, { language: 'fr' });

interface IMap extends MapViewProps {
  mapRef?: any;
  customStyle?: StyleProp<ViewStyle>;
}

const Map: React.FC<IMap> = React.memo(
  ({ children, mapRef = null, customStyle, region, ...props }) => {
    const currentPosition = useRecoilValue(currentPositionState);

    return (
      <MapView
        ref={mapRef}
        style={[styles.map, customStyle]}
        region={
          region || {
            latitude: currentPosition?.coords.latitude || INITIAL_LATITUDE,
            longitude: currentPosition?.coords.longitude || INITIAL_LONGITUDE,
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
