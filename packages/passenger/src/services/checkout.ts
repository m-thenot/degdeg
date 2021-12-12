import { firebase } from '@react-native-firebase/functions';
import { FIREBASE_REGION } from '@dagdag/common/constants';

interface ICustomer {
  customerId?: string;
  email: string;
  phoneNumber: string;
  name: string;
}

export const fetchSetupIntentClientSecret = async (customer: ICustomer) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('createSetupIntent')(customer);
  return result.data;
};

export const fetchPaymentMethods = async (customerId: string) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('getPaymentMethods')({ customerId });
  return result?.data?.paymentMethods;
};

export const proceedToPayment = async (
  customerId: string,
  paymentMethodId: string,
  amount: number,
) => {
  const result = await firebase
    .app()
    .functions(FIREBASE_REGION)
    .httpsCallable('proceedToPayment')({ customerId, paymentMethodId, amount });
  return result?.data;
};
