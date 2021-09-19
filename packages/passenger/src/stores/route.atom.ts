import { LatLng } from 'react-native-maps';
import { atom } from 'recoil';

interface IMetadataRoute {
  distance: number;
  duration: number;
  coordinates: LatLng[];
}

export const metadataRouteState = atom<IMetadataRoute | undefined>({
  key: 'metadataRoute',
  default: undefined,
});
