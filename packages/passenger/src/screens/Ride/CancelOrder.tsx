import { CancelReason } from '@constants/ride';
import { BackHeader, Button } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { RideStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OkIcon from '@dagdag/common/assets/icons/ok.svg';
import { updateOrder } from '@services/order';
import { OrderStatus } from '@dagdag/common/types';
import { useOrder } from '@context/order';

const reasons = {
  [CancelReason.DRIVER_NOT_REACHABLE]: 'Impossible de contacter le chauffeur',
  [CancelReason.DRIVER_LATE]: 'Le chauffeur est en retard',
  [CancelReason.PRICE_TOO_HIGH]: 'Le prix est trop élevé',
  [CancelReason.DEPARTURE_ADDRESS_INCORRECT]:
    "L'adresse de départ est incorrect",
  [CancelReason.OTHER]: 'Autre',
};

const CancelOrder: React.FC<
  NativeStackScreenProps<RideStackParamList, 'cancelOrder'>
> = ({ navigation }) => {
  const [reason, setReason] = useState<CancelReason>();
  const { order } = useOrder();

  const onSubmit = () => {
    updateOrder(
      { status: OrderStatus.CANCELED_BY_CUSTOMER, cancelReason: reason },
      order!.uid,
    );
    navigation.navigate('booking' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>
          Veuillez sélectionner la raison de l'annulation :
        </Text>

        <View style={styles.items}>
          {Object.keys(reasons).map((key, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => setReason(key as CancelReason)}>
              <View
                style={[styles.circle, reason === key && styles.circleFilled]}>
                <OkIcon />
              </View>
              <Text style={styles.reason}>{reasons[key]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button text="Soumettre" disabled={!reason} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default CancelOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
  },
  content: {
    paddingTop: layout.spacer8,
    flex: 1,
  },
  title: {
    color: colors.black,
    fontSize: font.fontSize4,
    fontWeight: 'bold',
  },
  reason: {
    color: colors.black,
    fontSize: font.fontSize2,
  },
  items: {
    marginVertical: layout.spacer6,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacer5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey1,
    marginRight: layout.spacer3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
