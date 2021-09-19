import { ARRIVAL, DEPARTURE } from '@constants/address';
import { GeoCoordinates } from 'react-native-geolocation-service';

export type AddressType = typeof ARRIVAL | typeof DEPARTURE;
export interface ICurrentPosition {
  formattedAddress: string;
  coords: GeoCoordinates;
}
