import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { ILocation } from '@internalTypes/geo';
import { updatePosition } from '@services/cars';

interface IContextProps {
  location: ILocation;
}

const LocationContext = createContext<Partial<IContextProps>>({
  location: undefined,
});

const LocationProvider: React.FC = ({ children }) => {
  const { user } = useFirebaseAuthentication();
  const [location, setLocation] = useState<ILocation | undefined>();

  useEffect(() => {
    if (location && user?.uid) {
      updatePosition(user?.uid, location);
    }
  }, [location, user?.uid]);

  useEffect(() => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result == RESULTS.GRANTED) {
        const _watchId = Geolocation.watchPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 100,
            interval: 10000,
            fastestInterval: 5000,
          },
        );

        return () => {
          if (_watchId) {
            Geolocation.clearWatch(_watchId);
          }
        };
      }
    });
  }, []);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

const useLocation = () => useContext(LocationContext);

export { LocationContext, LocationProvider, useLocation };
