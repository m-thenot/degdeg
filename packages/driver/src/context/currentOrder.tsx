import React, { createContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import { currentOrderState, ordersState } from '@stores/orders.atom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  getObjectData,
  removeData,
  storeObjectData,
} from '@dagdag/common/utils';
import { isOnlineState } from '@stores/driver.atom';

interface IContextProps {
  currentOrder: IOrder | null;
}

const CurrentOrderContext = createContext<Partial<IContextProps>>({});

const CurrentOrderProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const currentOrder = useRecoilValue(currentOrderState);
  const setIsOnline = useSetRecoilState(isOnlineState);

  useEffect(() => {
    const getSavedOrder = async () => {
      const savedOrder = await getObjectData('currentOrder');
      if (savedOrder) {
        setIsOnline(true);
        const newOrders = [JSON.parse(savedOrder)];
        setOrders(newOrders);
      }
    };

    getSavedOrder();
  }, []);

  useEffect(() => {
    const clearOrder = async () => {
      await removeData('currentOrder');
    };

    if (currentOrder?.status === OrderStatus.CANCELED_BY_DRIVER) {
      const newOrders = [...orders];
      newOrders.shift();
      setOrders(newOrders);
    }
    if (
      currentOrder?.status === OrderStatus.FINISHED ||
      currentOrder?.status?.startsWith('CANCEL')
    ) {
      clearOrder();
    }
  }, [currentOrder]);

  useEffect(() => {
    const saveOrder = async (order: IOrder) => {
      await storeObjectData(order, 'currentOrder');
    };
    if (currentOrder) {
      saveOrder(currentOrder);
    }
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
