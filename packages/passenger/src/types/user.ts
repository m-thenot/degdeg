export enum PAYMENT_TYPE {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
}

export interface IUser {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  customerId: string;
  defaultPaymentMethod?: {
    id?: string;
    last4?: string;
    brand?: string;
    type: PAYMENT_TYPE;
  };
  rating?: {
    overall: number;
    count: number;
  };
}
