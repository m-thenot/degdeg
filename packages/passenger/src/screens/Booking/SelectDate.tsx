import { BookingStackParamList } from '@internalTypes/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { colors, font, layout } from '@dagdag/common/theme';
import { BackHeader, Button } from '@dagdag/common/components';
import { getRound5Date, formatMinutes } from '@dagdag/common/utils';

import { useRecoilState } from 'recoil';
import { departureAtState } from '@stores/route.atom';
import { addMinutes } from 'date-fns';

const SelectDate: React.FC<
  NativeStackScreenProps<BookingStackParamList, 'selectDate'>
> = ({ navigation }) => {
  const [departureAt, setDepartureAt] = useRecoilState(departureAtState);

  const [date, setDate] = useState(departureAt || getRound5Date());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          marginTop={insets.top}
          title="Heure de départ"
        />
      ),
    });
  }, []);

  const datePlusTen = addMinutes(date, 10);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader navigation={navigation} title="Heure de départ" />
      <View style={styles.shortcuts}>
        <Button
          type="secondary"
          text="Dans 30min"
          onPress={() => setDate(addMinutes(getRound5Date(), 30))}
          style={styles.button}
          textStyle={styles.textButton}
        />
        <Button
          type="secondary"
          onPress={() => setDate(addMinutes(getRound5Date(), 60))}
          text="Dans 1h"
          style={[styles.button, styles.centeredButton]}
          textStyle={styles.textButton}
        />
        <Button
          type="secondary"
          onPress={() => setDate(addMinutes(getRound5Date(), 90))}
          text="Dans 1h30"
          style={styles.button}
          textStyle={styles.textButton}
        />
      </View>
      <DatePicker
        date={date}
        onDateChange={setDate}
        minuteInterval={5}
        locale="fr"
      />
      <Text style={styles.info}>
        Votre chauffeur arrivera entre {date.getHours()}:
        {formatMinutes(date.getMinutes())} et {datePlusTen.getHours()}:
        {formatMinutes(datePlusTen.getMinutes())}
      </Text>
      <Button
        text="Enregistrer"
        style={styles.save}
        onPress={() => {
          setDepartureAt(date);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default SelectDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
  },
  shortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: layout.spacer5,
    marginTop: layout.marginTop,
  },
  button: {
    padding: layout.spacer2,
    flex: 1,
    borderWidth: 1,
  },
  centeredButton: {
    marginHorizontal: layout.spacer1,
  },
  textButton: {
    fontWeight: '400',
    fontSize: font.fontSize2,
  },
  info: {
    marginTop: layout.spacer6,
    textAlign: 'center',
    fontSize: font.fontSize2,
    flex: 1,
  },
  save: {
    marginBottom: layout.spacer3,
  },
});
