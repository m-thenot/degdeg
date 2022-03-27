import { IVehicle } from '@dagdag/common/types';
import { getAllVehicleClass } from '@services/vehicle';
import React, { createContext, useContext, useEffect, useState } from 'react';

const VehiclesContext = createContext<{
  vehicles: IVehicle[];
}>({
  vehicles: [],
});

const VehiclesProvider: React.FC = ({ children }) => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);

  useEffect(() => {
    const getActiveVehicles = async () => {
      const data = await getAllVehicleClass();
      setVehicles(data);
    };

    getActiveVehicles();
  }, []);

  return (
    <VehiclesContext.Provider value={{ vehicles }}>
      {children}
    </VehiclesContext.Provider>
  );
};

const useVehicles = () => useContext(VehiclesContext);

export { VehiclesContext, VehiclesProvider, useVehicles };
