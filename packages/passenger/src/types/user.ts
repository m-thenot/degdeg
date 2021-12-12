export interface IUser {
  phoneNumber: string | null;
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  customerId: string;
  defaultPaymentMethod?: string;
}
