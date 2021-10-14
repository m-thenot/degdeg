import { IMetadataRoute } from '@dagdag/common/types';
import { atom } from 'recoil';

export const metadataRouteState = atom<IMetadataRoute | undefined>({
  key: 'metadataRoute',
  default: undefined,
});

export const departureAtState = atom<Date | undefined>({
  key: 'departureAt',
  default: undefined,
});
