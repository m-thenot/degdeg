import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { IOrder, OrderStatus } from '@dagdag/common/types';
import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import {
  getStringData,
  removeData,
  storeStringData,
} from '@dagdag/common/utils';

interface IContextProps {
  order: IOrder | null;
  resetOrder: () => void;
  setOrderUid: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  orderUid: string | null | undefined;
}

const OrderContext = createContext<Partial<IContextProps>>({});

const OrderProvider: React.FC = ({ children }) => {
  const [orderUid, setOrderUid] = useState<string | null | undefined>(null);
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    const getSavedOrder = async () => {
      const savedOrderUid = await getStringData('currentOrder');
      setOrderUid(savedOrderUid);
    };

    getSavedOrder();
  }, []);

  useEffect(() => {
    const saveOrderId = async (orderUid: string) => {
      await storeStringData(orderUid, 'currentOrder');
    };

    if (orderUid) {
      saveOrderId(orderUid);
      const orderSubscriber = firestore()
        .collection(ORDERS_COLLECTION)
        .doc(orderUid)
        .onSnapshot(async documentSnapshot => {
          if (documentSnapshot?.data()) {
            const updatedOrder = documentSnapshot.data() as IOrder;
            setOrder(updatedOrder);

            if (
              updatedOrder?.status === OrderStatus.FINISHED ||
              updatedOrder?.status.startsWith('CANCEL')
            ) {
              await removeData('currentOrder');
            }
          }
        });

      return () => orderSubscriber();
    }
  }, [orderUid]);

  const resetOrder = async () => {
    setOrder(null);
    setOrderUid(undefined);
    await removeData('currentOrder');
  };

  return (
    <OrderContext.Provider value={{ order, resetOrder, setOrderUid, orderUid }}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => useContext(OrderContext);

export { OrderContext, OrderProvider, useOrder };
