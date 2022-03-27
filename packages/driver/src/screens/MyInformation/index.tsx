import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Text, StyleSheet, View } from 'react-native';
import { BackHeader, Button, InlineInput } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { useForm } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import { VehicleType } from '@dagdag/common/types';
import { RoundIconButton } from '@dagdag/common/components/RoundIconButton';
import PlusIcon from '@dagdag/common/assets/icons/plus.svg';
import globalStyles from '@theme/globalStyles';
import { updateDriver } from '@services/driver';
import DGToast, { ToastTypes } from '@utils/toast';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { ScrollView } from 'react-native-gesture-handler';

const carsTypes = [
  {
    label: 'Économique',
    value: VehicleType.ECONOMIC,
  },
  {
    label: 'Premium',
    value: VehicleType.PREMIUM,
  },
  {
    label: 'Van',
    value: VehicleType.VAN,
  },
  {
    label: 'Taxi',
    value: VehicleType.TAXI,
  },
];

interface IData {
  model: string;
  brand: string;
  color: string;
  plate: string;
}

const MyInformation: React.FC<
  DrawerScreenProps<DrawerNavigatorParamList, 'my_information'>
> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useFirebaseAuthentication();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();
  const hasError = !Boolean(
    Object.keys(errors).length === 0 && errors.constructor === Object,
  );

  const [VehicleType, setVehicleType] = useState<null | VehicleType>(
    user?.car?.type || null,
  );

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Mes informations"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  const onSubmit = async (data: IData) => {
    if (!hasError) {
      await updateDriver({ car: { ...data, type: VehicleType } });
      DGToast.show(ToastTypes.DG_SUCCESS, {
        message:
          'Les données de votre véhicule ont été mise à jour avec succès !',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.carForm}>
          <Text style={styles.title}>Mon véhicule</Text>
          <InlineInput
            name="brand"
            initialValue={user?.car?.brand}
            label="Marque"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'La marque du véhicule est requise.',
              },
            }}
          />

          <InlineInput
            name="model"
            initialValue={user?.car?.model}
            label="Modèle"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Le modèle est requis.',
              },
            }}
          />

          <InlineInput
            name="color"
            label="Couleur"
            initialValue={user?.car?.color}
            control={control}
            rules={{
              required: {
                value: true,
                message: 'La couleur du véhicule est requise.',
              },
            }}
          />

          <InlineInput
            name="plate"
            initialValue={user?.car?.plate}
            label="Plaque d'immatriculation"
            control={control}
            rules={null}
          />
          <View style={styles.selectContainer}>
            <Text style={styles.label}>Classe de véhicule</Text>

            <RNPickerSelect
              onValueChange={value => setVehicleType(value)}
              placeholder={
                VehicleType
                  ? {}
                  : {
                      label: 'sélectionner',
                      value: null,
                      color: colors.grey3,
                    }
              }
              value={VehicleType}
              style={{
                viewContainer: styles.select,
                placeholder: styles.placeholder,
                inputIOS: styles.selectValue,
              }}
              items={carsTypes}
            />
          </View>
          {hasError && (
            <Text style={[globalStyles.error, styles.error]}>
              {errors[Object.keys(errors)[0]]?.message}
            </Text>
          )}
          <Button
            disabled={!isDirty}
            textStyle={styles.buttonText}
            text="Sauvegarder"
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View>
          <Text style={styles.title}>Mes documents</Text>

          <View style={styles.addDocument}>
            <RoundIconButton onPress={() => 0} size={30} style={styles.plus}>
              <PlusIcon />
            </RoundIconButton>
            <Text style={styles.addDocumentText}>
              Ajouter mon permis de conduire
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: layout.spacer9,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: layout.marginHorizontal,
  },
  title: {
    fontWeight: '700',
    fontSize: font.fontSize2,
    marginBottom: layout.spacer3,
  },
  carForm: {
    marginBottom: layout.spacer6,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey1,
    minHeight: 50,
  },
  label: {
    fontSize: font.fontSize2,
    color: colors.grey3,
  },
  select: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontStyle: 'italic',
    fontSize: font.fontSize2,
  },
  selectValue: {
    fontSize: font.fontSize2,
    color: colors.black,
  },
  button: {
    marginTop: layout.spacer5,
    padding: layout.spacer4,
  },
  buttonText: {
    fontSize: font.fontSize2,
  },
  plus: {
    backgroundColor: colors.primary,
    marginRight: layout.spacer3,
  },
  addDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layout.spacer3,
  },
  addDocumentText: {
    fontSize: font.fontSize2,
    color: colors.black,
  },
  error: {
    marginTop: layout.spacer4,
  },
});
