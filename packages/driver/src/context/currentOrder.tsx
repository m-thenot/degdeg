import React, { createContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import { useRecoilState, useRecoilValue } from 'recoil';

interface IContextProps {
  currentOrder: IOrder | null;
}

const CurrentOrderContext = createContext<Partial<IContextProps>>({});

const CurrentOrderProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const currentOrder = useRecoilValue(currentOrderState);

  useEffect(() => {
    if (currentOrder?.status === OrderStatus.CANCELED_BY_DRIVER) {
      const newOrders = [...orders];
      newOrders.shift();
      setOrders(newOrders);
    }
  }, [currentOrder]);

  useEffect(() => {
    const orderSubscriber = firestore()
      .collection('orders')
      .doc(currentOrder?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.data()) {
          const newOrders = [...orders];
          newOrders[0] = documentSnapshot.data() as IOrder;
          setOrders(newOrders);
        }
      });

    return () => orderSubscriber();
  }, [currentOrder?.uid]);

  return (
    <CurrentOrderContext.Provider value={{ currentOrder }}>
      {children}
    </CurrentOrderContext.Provider>
  );
};

export { CurrentOrderContext, CurrentOrderProvider };
