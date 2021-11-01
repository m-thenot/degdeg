import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { IOrder } from '@dagdag/common/types';
import { ORDERS_COLLECTION } from '@dagdag/common/constants';

interface IContextProps {
  order: IOrder | null;
  setOrderUid: React.Dispatch<React.SetStateAction<string | null>>;
}

const OrderContext = createContext<Partial<IContextProps>>({});

const OrderProvider: React.FC = ({ children }) => {
  const [orderUid, setOrderUid] = useState<string | null>(null);
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (orderUid) {
      const orderSubscriber = firestore()
        .collection(ORDERS_COLLECTION)
        .doc(orderUid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot?.data()) {
            setOrder(documentSnapshot.data() as IOrder);
          }
        });

      return () => orderSubscriber();
    }
  }, [orderUid]);

  return (
    <OrderContext.Provider value={{ order, setOrderUid }}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => useContext(OrderContext);

export { OrderContext, OrderProvider, useOrder };
