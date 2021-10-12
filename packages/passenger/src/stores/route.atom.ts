import { IMetadataRoute } from '@dagdag/common/constants';
import { atom } from 'recoil';

export const metadataRouteState = atom<IMetadataRoute | undefined>({
  key: 'metadataRoute',
  default: undefined,
});
