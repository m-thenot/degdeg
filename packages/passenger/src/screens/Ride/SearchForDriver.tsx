import { useOrder } from '@context/order';
import {
  CrossHeader,
  RoundBottom,
  RouteSummary,
} from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { getFormattedTime } from '@dagdag/common/utils';
import { RideStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapWrapper from '@screens/Booking/Cars/MapWrapper';
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

const SearchForDriver: React.FC<
  NativeStackScreenProps<RideStackParamList, 'searchForDriver'>
> = ({ navigation }) => {
  const { order } = useOrder();
  console.log(order);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CrossHeader onPress={() => 0} />,
    });
  }, []);

  return (
    <>
      <MapWrapper />
      <RoundBottom>
        <View style={styles.indicator}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.search}>
            Recherche de chauffeurs disponibles en cours...
          </Text>
        </View>

        {order && (
          <RouteSummary
            departureAddress={order.departureAddress.formattedAddress}
            arrivalAddress={order.arrivalAddress.formattedAddress}
            departureAt={order.departureAt}
          />
        )}
      </RoundBottom>
    </>
  );
};

export default SearchForDriver;

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  search: {
    fontSize: font.fontSize2,
    color: colors.black,
    marginLeft: layout.spacer3,
  },
});
