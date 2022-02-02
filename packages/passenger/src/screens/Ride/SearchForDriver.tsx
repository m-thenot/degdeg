import { useOrder } from '@context/order';
import { RoundBottom, RouteSummary } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchForDriver: React.FC = () => {
  const { order } = useOrder();
  const insets = useSafeAreaInsets();

  return (
    <RoundBottom customStyle={{ bottom: insets.bottom }}>
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
