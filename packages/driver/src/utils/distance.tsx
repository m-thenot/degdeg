import { ILocation } from '@internalTypes/geo';

export const getDistanceFromLatLonInKm = (
  coord1: ILocation,
  coord2: ILocation,
) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(coord2.latitude - coord1.latitude);
  var dLon = deg2rad(coord2.longitude - coord1.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.latitude)) *
      Math.cos(deg2rad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};
