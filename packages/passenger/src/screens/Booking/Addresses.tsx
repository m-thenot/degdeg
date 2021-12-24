import React, { useRef, useState, useEffect } from 'react';
import { Circle, Svg, Line, Polygon } from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@constants/maps';
import { DEPARTURE, ARRIVAL } from '@constants/address';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  arrivalAddressState,
  currentPositionState,
  departureAddressState,
} from '@stores/address.atom';
import { AddressType } from '@internalTypes/address';
import LocIcon from '@assets/icons/ic_loc.svg';
import PlaceIcon from '@assets/icons/ic_place.svg';
import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, layout } from '@dagdag/common/theme';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BackHeader } from '@dagdag/common/components';

const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  structured_formatting: Object;
  terms: Object[];
  types: string[];
};

const Item = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.prediction}
    onPress={onPress}
    activeOpacity={0.5}>
    <PlaceIcon width={25} height={25} />
    <View style={styles.predictionAddress}>
      <Text>{item.structured_formatting.main_text}</Text>
      <Text style={styles.secondaryText}>
        {item.structured_formatting.secondary_text}
      </Text>
    </View>
  </TouchableOpacity>
);

const Addresses: React.FC<
  NativeStackScreenProps<BookingStackParamList, 'addresses'>
> = ({ navigation }) => {
  const arrivalInputRef = useRef<any>(null);
  const departureInputRef = useRef<any>(null);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const [currentPredictionsType, setCurrentPredictionsType] =
    useState<AddressType>(ARRIVAL);
  const [departureAddress, setDepartureAddress] = useRecoilState(
    departureAddressState,
  );
  const currentPosition = useRecoilValue(currentPositionState);
  const insets = useSafeAreaInsets();

  const [arrivalAddress, setArrivalAddress] =
    useRecoilState(arrivalAddressState);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          marginTop={insets.top}
          title="Saisir l'adresse"
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (departureAddress.text === '' && currentPosition?.formattedAddress) {
      setDepartureAddress({
        isSelected: true,
        text: currentPosition?.formattedAddress,
      });
    }
  }, [currentPosition]);

  const onPressItem = (item: PredictionType) => {
    if (currentPredictionsType === ARRIVAL) {
      setArrivalAddress({ text: item.description, isSelected: true });
      departureAddress.isSelected
        ? navigation.navigate('cars')
        : departureInputRef?.current?.focus();
    } else {
      setDepartureAddress({ text: item.description, isSelected: true });
      arrivalAddress.isSelected
        ? navigation.navigate('cars')
        : arrivalInputRef?.current?.focus();
    }
  };

  const onPressSelectPosition = () => {
    const type = departureInputRef.current?.isFocused() ? DEPARTURE : ARRIVAL;
    navigation.navigate('pickPoint', { type });
  };

  const renderItem = ({ item }) => (
    <Item item={item} onPress={() => onPressItem(item)} />
  );

  const onChangeAddress = async (text: string, type: AddressType) => {
    // TODO: remove fr on production
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_MAPS_API_KEY}&input=${text}&location=${currentPosition?.coords.latitude},${currentPosition?.coords.longitude}&components=country:fr|country:dj`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: { predictions: p },
        } = result;
        setPredictions(p);
        setCurrentPredictionsType(type);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shadow}>
        <View style={styles.addresses}>
          <View style={styles.elements}>
            <Svg height="10" width="10">
              <Circle cx="5" cy="5" r="5" fill={colors.primary} />
            </Svg>
            <Svg style={styles.line} height="32" width="4">
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2="32"
                stroke={colors.grey3}
                strokeWidth="4"
              />
            </Svg>
            <Svg height="10" width="12">
              <Polygon points="0,0 12,0 6,10" fill={colors.grey3} />
            </Svg>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.departureAddress]}
              onChangeText={text => {
                setDepartureAddress({ isSelected: false, text });
                onChangeAddress(text, DEPARTURE);
              }}
              value={departureAddress.text}
              defaultValue={currentPosition?.formattedAddress}
              placeholder="Mon point de rendez-vous"
              multiline={true}
              ref={departureInputRef}
            />
            <TextInput
              style={styles.input}
              ref={arrivalInputRef}
              value={arrivalAddress.text}
              autoFocus={true}
              onChangeText={text => {
                setArrivalAddress({ isSelected: false, text });
                onChangeAddress(text, ARRIVAL);
              }}
              placeholder="Où aller ?"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.pointButton}
        onPress={onPressSelectPosition}>
        <LocIcon width={40} height={40} />
        <Text style={styles.point}> Sélectionner un point sur la carte</Text>
      </TouchableOpacity>

      <FlatList
        data={predictions}
        style={styles.predictions}
        renderItem={renderItem}
        keyExtractor={item => item.place_id}
      />
    </SafeAreaView>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: layout.spacer8,
  },
  shadow: {
    borderRadius: 20,
    marginHorizontal: layout.spacer5,
    marginTop: layout.spacer1,
    marginBottom: layout.spacer4,
    shadowColor: 'rgba(0,0,0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  addresses: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacer3,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  elements: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacer5,
  },
  inputContainer: {
    flex: 1,
  },
  departureAddress: {
    borderBottomWidth: 0.5,
    borderColor: colors.grey1,
  },
  input: {
    paddingVertical: layout.spacer4,
    color: colors.black,
  },
  line: {
    marginVertical: layout.spacer2,
  },
  predictions: {
    paddingLeft: layout.spacer6,
    minHeight: Dimensions.get('window').width, // Prevent predictions to disappear when keyboard is open
  },
  prediction: {
    paddingVertical: layout.spacer2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionAddress: {
    marginLeft: layout.spacer4,
  },
  secondaryText: {
    color: colors.grey2,
  },
  pointButton: {
    marginLeft: layout.spacer5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    color: colors.primary,
    fontWeight: '700',
    marginLeft: layout.spacer2,
    marginBottom: layout.spacer2,
    paddingTop: layout.spacer2,
  },
});
