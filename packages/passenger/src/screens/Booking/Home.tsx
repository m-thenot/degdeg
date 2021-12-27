import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Platform,
} from 'react-native';
import { BookingStackParamList } from '@internalTypes/navigation';
import { MenuHeader, RoundBottom } from '@dagdag/common/components';
import Map from '@components/Map';
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
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

const Home: React.FC<StackScreenProps<BookingStackParamList, 'home'>> = ({
  navigation,
}) => {
  const { user } = useFirebaseAuthentication();
  const setCurrentPosition = useSetRecoilState(currentPositionState);
  const setArrivalAddress = useSetRecoilState(arrivalAddressState);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Reset arrival address
    setArrivalAddress(defaultAddress);

    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result == RESULTS.GRANTED) {
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
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MenuHeader
        navigation={navigation}
        backgroundColor="transparent"
        style={[styles.header, { top: insets.top }]}
      />
      <Map showsMyLocationButton showsUserLocation />
      <RoundBottom>
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
      </RoundBottom>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: layout.marginHorizontal,
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
