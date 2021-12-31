import React, { useState } from 'react';
import { Button, RoundBottom } from '@dagdag/common/components';
import { StyleSheet, View, Text, Image } from 'react-native';
import StarIcon from '@dagdag/common/assets/icons/rating.svg';
import { layout, colors, font } from '@dagdag/common/theme';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import PhotoUser from '@assets/icons/photo-user.svg';
import { updateRating } from '@dagdag/common/services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Finished: React.FC = () => {
  const [rating, setRating] = useState(5);
  const currentOrder = useRecoilValue(currentOrderState);
  const [orders, setOrders] = useRecoilState(ordersState);
  const insets = useSafeAreaInsets();

  const onPressSubmit = async () => {
    try {
      await updateRating({
        rating,
        overallRating: currentOrder?.user?.rating?.overall || 5,
        ratingsCount: currentOrder?.user?.rating?.count || 3,
        uid: currentOrder?.user?.id!,
        isPassengerRating: true,
      });
    } catch (e) {
      console.log(e);
    }

    // Remove current order from orders request
    const newOrders = [...orders];
    newOrders.shift();
    setOrders(newOrders);
  };

  return (
    <RoundBottom customStyle={{ bottom: insets.bottom }}>
      <View style={styles.passenger}>
        {currentOrder?.user.image ? (
          <Image
            width={100}
            height={100}
            source={{
              uri: currentOrder?.user.image,
            }}
          />
        ) : (
          <PhotoUser height={90} width={90} />
        )}

        <Text style={styles.firstName}>{currentOrder?.user.firstName}</Text>
      </View>

      <Text style={styles.title}>Notez votre passager</Text>
      <View style={styles.rates}>
        {[1, 2, 3, 4, 5].map((value, index) => (
          <StarIcon
            key={index}
            onPress={() => setRating(value)}
            width={40}
            height={40}
            style={styles.rate}
            fill={rating >= value ? colors.primary : colors.grey1}
          />
        ))}
      </View>
      <Button text="Envoyer" onPress={onPressSubmit} />
    </RoundBottom>
  );
};

const styles = StyleSheet.create({
  passenger: {
    alignItems: 'center',
  },
  firstName: {
    fontSize: font.fontSize3,
    color: colors.black,
    fontWeight: '700',
    marginTop: layout.spacer2,
  },
  title: {
    fontSize: font.fontSize2,
    textAlign: 'center',
    color: colors.black,
    marginVertical: layout.spacer4,
  },
  rates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacer5,
  },
  rate: {
    marginHorizontal: layout.spacer1,
  },
});

export default Finished;
