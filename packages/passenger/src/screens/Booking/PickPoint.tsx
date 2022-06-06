import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {
  arrivalAddressState,
  currentPositionState,
  departureAddressState,
} from '@stores/address.atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BackHeader, Button, Map } from '@dagdag/common/components';
import { DEPARTURE } from '@constants/address';
import { LatLng, Marker } from 'react-native-maps';
import {
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '@dagdag/common/constants';
import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, layout, font, headerHeight } from '@dagdag/common/theme';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GOOGLE_MAPS_API_KEY } from '@constants/maps';

interface IDraggablePosition {
  coordinates: LatLng;
  text: string;
}

const PickPoint: React.FC<
  NativeStackScreenProps<BookingStackParamList, 'pickPoint'>
> = ({ route, navigation }) => {
  const [draggablePosition, setDraggablePosition] = useState<
    IDraggablePosition | undefined
  >();
  const [arrivalAddres, setArrivalAddress] =
    useRecoilState(arrivalAddressState);
  const [departureAddress, setDepartureAddress] = useRecoilState(
    departureAddressState,
  );
  const currentPosition = useRecoilValue(currentPositionState);
  const insets = useSafeAreaInsets();

  const placeholder =
    route.params.type === DEPARTURE ? "D'où partez-vous ? " : 'Où allez-vous ?';

  const onDragEnd = (coordinates: LatLng) => {
    Geocoder.from({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }).then(res => {
      setDraggablePosition({
        coordinates: coordinates,
        text: res.results[0].formatted_address,
      });
    });
  };

  const onPressFinish = () => {
    let isRouteCompleted = false;
    const newAddress = {
      isSelected: true,
      text: draggablePosition!.text,
      coordinates: draggablePosition?.coordinates,
    };
    if (route.params.type === DEPARTURE) {
      setDepartureAddress(newAddress);
      isRouteCompleted = arrivalAddres.isSelected;
    } else {
      setArrivalAddress(newAddress);
      isRouteCompleted = departureAddress.isSelected;
    }
    isRouteCompleted ? navigation.navigate('cars') : navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        navigation={navigation}
        style={[styles.header, { top: insets.top }]}
      />

      <Map
        apiKey={GOOGLE_MAPS_API_KEY}
        showsMyLocationButton
        region={
          draggablePosition?.coordinates && {
            ...draggablePosition?.coordinates,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        }>
        <Marker
          draggable
          coordinate={
            draggablePosition?.coordinates ||
            currentPosition?.coords || {
              latitude: INITIAL_LATITUDE,
              longitude: INITIAL_LONGITUDE,
            }
          }
          onDragEnd={e => onDragEnd(e.nativeEvent.coordinate)}
          title="Adresse sélectionnée: "
          description={draggablePosition?.text}
        />
      </Map>
      <View style={topStyles(insets.top)}>
        <Text style={styles.address}>
          {draggablePosition?.text || placeholder}
        </Text>
      </View>

      <Button
        text="Terminer"
        onPress={onPressFinish}
        onPressIn={onPressFinish}
        style={styles.positionButton}
        disabled={!draggablePosition}
      />
    </SafeAreaView>
  );
};

export default PickPoint;

const topStyles = (insetTop: number): StyleProp<ViewStyle> => ({
  position: 'absolute',
  backgroundColor: colors.white,
  top: Platform.OS === 'ios' ? headerHeight + insetTop : headerHeight,
  width: '100%',
  paddingHorizontal: layout.spacer5,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    paddingLeft: layout.marginHorizontal,
    width: '100%',
  },
  positionButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: layout.spacer3,
    marginHorizontal: layout.marginHorizontal,
    zIndex: 30,
    width: Dimensions.get('window').width - 2 * layout.marginHorizontal,
  },
  address: {
    color: colors.black,
    fontSize: font.fontSize4,
    paddingVertical: layout.spacer4,
  },
});
