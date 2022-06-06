import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { IOrder, OrderStatus, RideType } from '@dagdag/common/types';
import { ORDERS_COLLECTION } from '@dagdag/common/constants';
import {
  getStringData,
  removeData,
  storeStringData,
} from '@dagdag/common/utils';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';

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
  const { user } = useFirebaseAuthentication();

  useEffect(() => {
    const getSavedOrder = async () => {
      const savedOrderUid = await getStringData('currentOrder');
      setOrderUid(savedOrderUid);
    };

    getSavedOrder();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const prebooksSubscriber = firestore()
        .collection('orders')
        .where('rideType', '==', RideType.LATER)
        .where('status', '==', OrderStatus.DRIVER_ON_THE_WAY)
        .where('user.id', '==', user.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot?.docs) {
            const newCurrentOrder = documentSnapshot.docs.map(
              doc => doc.data() as IOrder,
            )[0];
            if (newCurrentOrder && newCurrentOrder.uid !== orderUid) {
              setOrderUid(newCurrentOrder.uid);
            }
          }
        });

      return () => prebooksSubscriber();
    }
  }, [user?.uid]);

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
