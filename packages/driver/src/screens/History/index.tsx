import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Text, StyleSheet, View } from 'react-native';
import { BackHeader } from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { addDays, format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import CarIcon from '@assets/icons/car.svg';
import MoneyIcon from '@assets/icons/money.svg';
import { getOrdersByDate } from '@services/order';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { IOrder } from '@dagdag/common/types';
import OrdersHistory from '@dagdag/common/components/OrdersHistory';

const History: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'history'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { user } = useFirebaseAuthentication();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Historique"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  const getLast15Days = () => {
    const arr: any[] = [];
    const date = new Date();
    for (let i = 16; i >= 0; i--) {
      const oldDate = subDays(date, i);
      arr.push({
        dayweek: format(oldDate, 'eee', { locale: fr }).replace('.', ''),
        day: oldDate.getDate(),
        completeDate: oldDate,
      });
    }
    return arr;
  };

  useEffect(() => {
    const getOrders = async () => {
      const dateAtMidnight = currentDate.setHours(0, 0, 0, 0);
      const dateNextDay = addDays(dateAtMidnight, 1).getTime();
      const orders = await getOrdersByDate(
        user?.uid,
        dateAtMidnight,
        dateNextDay,
      );
      setOrders(orders.map(order => order.data()) as IOrder[]);
    };

    getOrders();
  }, [currentDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}>
        {getLast15Days().map(date => (
          <TouchableOpacity
            style={[
              styles.date,
              currentDate.getDate() === date.day && styles.active,
            ]}
            onPress={() => setCurrentDate(date.completeDate)}
            key={date.date}>
            <Text
              style={[
                styles.dayweek,
                currentDate.getDate() === date.day && styles.activeText,
              ]}>
              {date.dayweek}
            </Text>
            <Text
              style={[
                styles.dateText,
                currentDate.getDate() === date.day && styles.activeText,
              ]}>
              {date.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <CarIcon width={35} height={35} />
          <View style={styles.textStat}>
            <Text style={styles.label}>Courses</Text>
            <Text style={styles.number}>{orders.length}</Text>
          </View>
        </View>
        <View style={styles.stat}>
          <MoneyIcon width={35} height={35} />
          <View style={styles.textStat}>
            <Text style={styles.label}>Gains</Text>
            <Text style={styles.number}>
              {orders.length > 0 ? orders.reduce((a, b) => a + b?.price, 0) : 0}{' '}
              DJF
            </Text>
          </View>
        </View>
      </View>

      <OrdersHistory orders={orders} />
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
  },
  date: {
    backgroundColor: colors.grey4,
    borderRadius: border.radius2,
    width: 42,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: layout.spacer4,
  },
  dateText: {
    color: colors.grey3,
  },
  activeText: {
    color: colors.primary,
  },
  dayweek: {
    color: colors.grey3,
    textTransform: 'capitalize',
  },
  active: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacer2,
  },
  stat: {
    backgroundColor: colors.grey4,
    flexDirection: 'row',
    borderRadius: border.radius2,
    width: '48%',
    padding: layout.spacer3,
  },
  number: {
    color: colors.black,
    fontSize: font.fontSize2,
    fontWeight: 'bold',
  },
  label: {
    color: colors.black,
    fontSize: font.fontSize1_5,
  },
  textStat: {
    marginLeft: layout.spacer4,
  },
  scrollView: {
    maxHeight: 54,
    marginBottom: layout.spacer3,
  },
});
