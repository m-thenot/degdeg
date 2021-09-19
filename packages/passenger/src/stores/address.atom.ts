import { LatLng } from 'react-native-maps';
import { atom } from 'recoil';
import { ICurrentPosition } from '@internalTypes/address';

interface IAddress {
  text: string;
  isSelected: boolean;
  coordinates?: LatLng;
}

export const defaultAddress = {
  text: '',
  isSelected: false,
  coordinates: undefined,
};

export const departureAddressState = atom<IAddress>({
  key: 'departureAddress',
  default: defaultAddress,
});

export const arrivalAddressState = atom<IAddress>({
  key: 'arrivalAddress',
  default: defaultAddress,
});

export const currentPositionState = atom<ICurrentPosition | null>({
  key: 'currentPosition',
  default: null,
});
