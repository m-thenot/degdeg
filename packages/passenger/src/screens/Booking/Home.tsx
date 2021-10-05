import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { BookingStackParamList } from '@internalTypes/navigation';
import { MenuHeader } from '@dagdag/common/components';
import Map from '@components/Map';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import { useSetRecoilState } from 'recoil';
import {
  arrivalAddressState,
  currentPositionState,
  defaultAddress,
} from '@stores/address.atom';
import { colors, layout, font, border } from '@dagdag/common/theme';

const Home: React.FC<NativeStackScreenProps<BookingStackParamList, 'home'>> = ({
  navigation,
}) => {
  const { user } = useFirebaseAuthentication();
  const setCurrentPosition = useSetRecoilState(currentPositionState);
  const setArrivalAddress = useSetRecoilState(arrivalAddressState);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => <MenuHeader navigation={navigation} />,
    });

    // Reset arrival address
    setArrivalAddress(defaultAddress);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        Geocoder.from({
          latitude: latitude,
          longitude: longitude,
        }).then(res => {
          setCurrentPosition({
            formattedAddress: res.results[0].formatted_address,
            coords: position.coords,
          });
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Map showsMyLocationButton showsUserLocation />
      <View style={styles.bottom}>
        <Text style={styles.firstName}>Bonjour {user?.firstName} !</Text>
        <Text style={styles.title}>Où allez-vous ?</Text>
        <View style={styles.shadow}>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={colors.grey4}
            onPress={() => navigation.navigate('addresses')}
            style={styles.departure}>
            <Text style={styles.fakeInput}>Saisir votre destination</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: border.radius4,
    borderTopRightRadius: border.radius4,
    backgroundColor: colors.white,
    paddingHorizontal: layout.spacer5,
    paddingVertical: layout.spacer5,
  },
  firstName: {
    marginBottom: layout.spacer1,
  },
  title: {
    fontSize: font.fontSize4,
    fontWeight: '700',
    marginBottom: layout.spacer2,
  },
  shadow: {
    marginBottom: layout.spacer3,
    shadowColor: 'rgba(0,0,0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'transparent',
    borderRadius: border.radius3,
  },
  departure: {
    borderRadius: border.radius3,
    backgroundColor: colors.white,
    paddingLeft: layout.spacer3,
    paddingVertical: layout.spacer4,
  },
  fakeInput: {
    fontSize: font.fontSize2,
    color: colors.grey3,
  },
});
