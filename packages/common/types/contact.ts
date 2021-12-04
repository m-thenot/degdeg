import { DRIVER, PASSENGER } from '../constants';

export interface IEmail {
  from: string;
  message: string;
  uid: string;
  firstName: string;
  userType: typeof PASSENGER | typeof DRIVER;
}
