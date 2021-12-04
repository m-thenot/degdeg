export interface IEmail {
  from: string;
  message: string;
  uid: string;
  firstName: string;
  userType: 'PASSENGER' | 'DRIVER';
}
