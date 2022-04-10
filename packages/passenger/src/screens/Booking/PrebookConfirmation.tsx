import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BackHeader, Button } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { useOrder } from '@context/order';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';

const PrebookConfirmation: React.FC<
  NativeStackScreenProps<BookingStackParamList, 'prebookConfirmation'>
> = ({ navigation }) => {
  const { order, resetOrder } = useOrder();
  const prebookOrder = useRef(order);

  useEffect(() => {
    if (order) {
      prebookOrder.current = order;
      resetOrder?.();
    }
  }, [order]);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        navigation={navigation}
        style={styles.margin}
        onPress={() => navigation.navigate('home')}
      />
      <Text style={styles.title}>Votre course a bien été réservée !</Text>

      {prebookOrder.current ? (
        <OrdersHistory
          orders={[prebookOrder.current]}
          isPassengerHistory
          hasStatusDisplayed={false}
          hasDateDisplayed
          scrollEnabled={false}
        />
      ) : (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      )}

      <Button
        text="Réserver une autre course"
        onPress={() => navigation.navigate('addresses')}
        style={styles.margin}
      />
    </SafeAreaView>
  );
};

export default PrebookConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.black,
    fontSize: font.fontSize4,
    fontWeight: 'bold',
    marginTop: layout.spacer3,
    marginBottom: layout.spacer3,
    paddingHorizontal: layout.marginHorizontal,
  },
  margin: {
    marginHorizontal: layout.marginHorizontal,
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
    marginTop: -100,
  },
});
