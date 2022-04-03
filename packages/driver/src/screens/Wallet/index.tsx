import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { BackHeader } from '@dagdag/common/components';
import { border, colors, font, layout } from '@dagdag/common/theme';
import ArrowIcon from '@dagdag/common/assets/icons/left-arrow.svg';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { IOrder } from '@dagdag/common/types';
import { getOrdersByDate } from '@services/order';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TouchableOpacity } from 'react-native-gesture-handler';

const weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const Wallet: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'wallet'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useFirebaseAuthentication();
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeDay, setActiveDay] = useState(-1);
  const startOfWeekDate = startOfWeek(currentDate);
  const isLastWeek =
    startOfWeekDate.getTime() === startOfWeek(Date.now()).getTime();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Mes gains"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getOrdersByDate(
        user?.uid,
        startOfWeek(currentDate).getTime(),
        addDays(currentDate, 7).getTime(),
      );
      setOrders(orders.map(order => order.data()) as IOrder[]);
    };

    getOrders();
  }, [currentDate]);

  const renderBars = () => {
    const ret: any[] = [];
    const ordersByWeekdays = orders.map(order => ({
      ...order,
      departureAt: new Date(order.departureAt).getDate(),
    }));

    weekdays.map((day, index) => {
      const ordersOfTheDay = ordersByWeekdays.filter(
        order =>
          order.departureAt === addDays(startOfWeekDate, index).getDate(),
      );

      const height =
        ordersOfTheDay.length > 0
          ? ordersOfTheDay.reduce((a, b) => a + b?.price, 10)
          : 5;

      ret.push(
        <Pressable
          onPress={() => setActiveDay(index)}
          key={index}
          style={styles.barContainer}>
          <View
            style={[
              styles.bar,
              { height: height, opacity: index === activeDay ? 1 : 0.7 },
            ]}
          />
          <Text style={styles.day}>{day}</Text>
          {index === activeDay && (
            <View style={styles.dayPriceContainer}>
              <View style={styles.dayPrice}>
                <Text>{ordersOfTheDay.length > 0 ? height : 0} DJF</Text>
              </View>
              <View style={styles.line} />
            </View>
          )}
        </Pressable>,
      );
    });
    return ret;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>
            {format(startOfWeekDate, 'MMM', { locale: fr })}{' '}
            {startOfWeekDate.getDate()}-{addDays(startOfWeekDate, 7).getDate()}
          </Text>
          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => setCurrentDate(subDays(currentDate, 7).getTime())}>
              <ArrowIcon width={15} height={15} />
            </TouchableOpacity>
            <Text style={styles.total}>
              {orders.length > 0 ? orders.reduce((a, b) => a + b?.price, 0) : 0}{' '}
              DJF
            </Text>
            <TouchableOpacity
              style={styles.arrowButton}
              disabled={isLastWeek}
              onPress={() => setCurrentDate(addDays(currentDate, 7).getTime())}>
              <ArrowIcon
                width={15}
                height={15}
                opacity={isLastWeek ? 0.3 : 1}
                style={[styles.arrowRight]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.graph}>{renderBars()}</View>
        <View style={styles.separator} />
        <View style={styles.footer}>
          <View>
            <Text style={styles.metaLabel}>Courses</Text>
            <Text style={styles.metaValue}>{orders.length}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Temps en course</Text>
            <Text style={styles.metaValue}>
              {orders.length > 0
                ? Math.round(
                    orders.reduce((a, b) => a + b?.metadataRoute.duration, 0),
                  )
                : 0}{' '}
              min
            </Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Distance</Text>
            <Text style={styles.metaValue}>
              {orders.length > 0
                ? Math.round(
                    orders.reduce((a, b) => a + b?.metadataRoute.distance, 0),
                  )
                : 0}{' '}
              km
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: border.radius4,
    paddingHorizontal: layout.spacer3,
    paddingVertical: layout.spacer4,
    shadowColor: colors.grey3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    zIndex: 999,
  },
  arrowRight: {
    transform: [{ rotateY: '180deg' }],
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layout.spacer1,
  },
  total: {
    marginHorizontal: layout.spacer5,
    fontSize: font.fontSize4,
    color: colors.black,
    fontWeight: 'bold',
  },
  date: {
    fontSize: font.fontSize1,
    color: colors.grey2,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '60%',
    marginHorizontal: layout.spacer4,
    backgroundColor: colors.primary,
    borderRadius: border.radius1,
  },
  graph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: layout.spacer6,
    minHeight: 150,
  },
  day: {
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 2,
  },
  separator: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.grey1,
    marginTop: layout.spacer6,
    marginBottom: layout.spacer5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  metaLabel: {
    color: colors.grey2,
    fontSize: font.fontSize1_5,
  },
  metaValue: {
    color: colors.black,
    fontSize: font.fontSize2,
    marginTop: layout.spacer1,
  },
  arrowButton: {
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
  dayPrice: {
    backgroundColor: colors.grey1,
    borderRadius: border.radius2,
    padding: layout.spacer1,
  },
  dayPriceContainer: {
    alignItems: 'center',
    position: 'absolute',
    zIndex: 20,
    top: -35,
    left: 5,
  },
  line: {
    width: 2,
    height: 10,
    backgroundColor: colors.grey1,
  },
});
