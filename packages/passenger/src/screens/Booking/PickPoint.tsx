import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';
import {
  arrivalAddressState,
  currentPositionState,
  departureAddressState,
} from '@stores/address.atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Button } from '@dagdag/common/components';
import { DEPARTURE } from '@constants/address';
import Map from '@components/Map';
import { LatLng, Marker } from 'react-native-maps';
import {
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '@constants/maps';
import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, layout, font } from '@dagdag/common/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <Map
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

      <View style={styles.top}>
        <Text style={styles.address}>
          {draggablePosition?.text || placeholder}
        </Text>
      </View>

      <Button
        text="Terminer"
        style={styles.positionButton}
        onPress={onPressFinish}
      />
    </SafeAreaView>
  );
};

export default PickPoint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  positionButton: {
    marginHorizontal: layout.marginHorizontal,
    marginBottom: layout.spacer3,
  },
  top: {
    position: 'absolute',
    backgroundColor: colors.white,
    top: Platform.OS === 'ios' ? 91 : 50,
    width: '100%',
    paddingHorizontal: layout.spacer5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  address: {
    color: colors.black,
    fontSize: font.fontSize4,
    paddingVertical: layout.spacer4,
  },
});
