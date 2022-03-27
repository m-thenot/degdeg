import { fetchPaymentMethods } from '@services/checkout';
import { updateUser } from '@services/user';
import { PaymentMethod } from '@internalTypes/payment';
import { useState } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import useFirebaseAuthentication from './useFirebaseAuthentification';
import { PAYMENT_TYPE } from '@dagdag/common/types';

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { user } = useFirebaseAuthentication();
  const [isLoading, setIsLoading] = useState(true);

  const getPaymentMethods = async () => {
    try {
      const newPaymentMethods: { data: PaymentMethod[] } =
        await fetchPaymentMethods(user?.customerId);
      if (
        newPaymentMethods.data.length > 0 &&
        ((paymentMethods.length > 0 &&
          newPaymentMethods.data.length > paymentMethods.length) || // Make new payment method as default payment method
          !newPaymentMethods.data.find(
            paymentMethod => paymentMethod.id === user?.defaultPaymentMethod, // Change default payment method if it is not exist anymore
          ))
      ) {
        await updateUser({
          defaultPaymentMethod: {
            id: newPaymentMethods.data[0].id,
            last4: newPaymentMethods.data[0].card.last4,
            brand: newPaymentMethods.data[0].card.brand,
            type: PAYMENT_TYPE.CREDIT_CARD,
          },
        });
      }
      setPaymentMethods(newPaymentMethods?.data || []);
      setIsLoading(false);
    } catch (e) {
      crashlytics().recordError(e as any);
      console.error(e);
    }
  };

  return {
    isLoading,
    paymentMethods,
    getPaymentMethods,
  };
};

export default usePaymentMethods;
