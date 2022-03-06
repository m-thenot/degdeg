import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import { updateRating } from '@dagdag/common/services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import crashlytics from '@react-native-firebase/crashlytics';
import Rating from '@dagdag/common/components/Rating';

const Finished: React.FC = () => {
  const currentOrder = useRecoilValue(currentOrderState);
  const [orders, setOrders] = useRecoilState(ordersState);
  const insets = useSafeAreaInsets();

  const onPressSubmit = async (rating: number) => {
    try {
      await updateRating({
        rating,
        overallRating: currentOrder?.user?.rating?.overall,
        ratingsCount: currentOrder?.user?.rating?.count,
        uid: currentOrder?.user?.id!,
        isPassengerRating: true,
      });
    } catch (e: any) {
      console.error(e);
      crashlytics().recordError(e);
    }

    // Remove current order from orders request
    const newOrders = [...orders];
    newOrders.shift();
    setOrders(newOrders);
  };

  return (
    <Rating
      personToBeEvaluated={currentOrder?.user!}
      onSubmit={onPressSubmit}
      style={{ bottom: insets.bottom }}
      text="Notez votre passager"
    />
  );
};

export default Finished;
