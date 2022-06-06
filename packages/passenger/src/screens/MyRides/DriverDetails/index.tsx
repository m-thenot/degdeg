import { MyRidesStackParamList } from '@internalTypes/navigation';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  BackHeader,
  ContactProfile,
  InlineInput,
  Loader,
} from '@dagdag/common/components';
import { border, colors, layout } from '@dagdag/common/theme';
import { getDriver } from '@services/driver';
import { IDriver } from '@dagdag/common/types';
import { useForm } from 'react-hook-form';
import { fr } from 'date-fns/locale';
import format from 'date-fns/format';
import { StackScreenProps } from '@react-navigation/stack';

const DriverDetails: React.FC<
  StackScreenProps<MyRidesStackParamList, 'driverDetails'>
> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [driver, setDriver] = useState<IDriver | null>(null);
  const { driverId } = route?.params;
  const { control } = useForm();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Chauffeur"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useEffect(() => {
    const getDriverData = async () => {
      const driver = await getDriver(driverId);
      setDriver(driver);
    };

    getDriverData();
  }, []);

  if (!driver) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <ContactProfile
          size="large"
          firstName={driver.firstName || ''}
          image={driver.image}
          rating={driver.rating?.overall}
        />
      </View>
      <View style={styles.attributes}>
        <InlineInput
          name="membership"
          initialValue={
            'le ' +
            format(driver.memberSince, 'dd/MM/yyyy', {
              locale: fr,
            })
          }
          label="Membre depuis"
          control={control}
          editable={false}
        />
        <InlineInput
          name="model"
          initialValue={driver.car.brand + ' ' + driver.car.model}
          label="Modèle"
          editable={false}
          control={control}
        />
        <InlineInput
          name="color"
          label="Couleur"
          initialValue={driver.car.color}
          editable={false}
          control={control}
        />
        {driver.car?.plate ? (
          <InlineInput
            name="plate"
            initialValue={driver.car.plate}
            label="Plaque d'immatriculation"
            editable={false}
            control={control}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default DriverDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
  },

  profile: {
    paddingLeft: layout.spacer5,
  },

  attributes: {
    borderWidth: 1,
    borderColor: colors.grey1,
    padding: layout.spacer5,
    borderRadius: border.radius3,
    marginTop: layout.spacer6,
  },
});
