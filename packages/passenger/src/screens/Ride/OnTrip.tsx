import { useOrder } from '@context/order';
import { Button, ContactProfile, RoundBottom } from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OnTrip: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { order } = useOrder();
  const { firstName, car } = order!.driver!;

  return (
    <RoundBottom customStyle={{ bottom: insets.bottom }}>
      <View style={styles.driver}>
        <ContactProfile firstName={firstName} />
        <View style={styles.car}>
          <Text style={styles.licencePlate}>{car?.plate}</Text>
          <Text style={styles.model}>{car?.model}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          text="Évaluer"
          style={[styles.button, styles.rateButton]}
          onPress={() => 0}
        />
        <Button
          type="secondary"
          style={styles.button}
          text="Pourboire"
          onPress={() => 0}
        />
      </View>
    </RoundBottom>
  );
};

export default OnTrip;

const styles = StyleSheet.create({
  driver: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  car: {
    alignItems: 'flex-end',
  },
  licencePlate: {
    fontWeight: 'bold',
    backgroundColor: colors.grey1,
    padding: layout.spacer1,
    borderRadius: border.radius2,
    marginBottom: 2,
  },
  model: {
    fontSize: font.fontSize1_5,
    color: colors.grey3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layout.spacer6,
  },
  button: {
    flex: 1,
  },
  rateButton: {
    marginRight: layout.spacer3,
  },
});
