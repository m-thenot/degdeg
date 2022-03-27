import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VehicleType, IVehicle } from '@dagdag/common/types';
import { useRecoilState } from 'recoil';
import { vehicleState } from '@stores/vehicle.atom';
import { colors, layout, font, border } from '@dagdag/common/theme';

const CarsImages = {
  [VehicleType.ECONOMIC]: require('@assets/images/standard.png'),
  [VehicleType.PREMIUM]: require('@assets/images/exec.png'),
  [VehicleType.VAN]: require('@assets/images/van.png'),
  [VehicleType.TAXI]: require('@assets/images/taxi.png'), // TODO: addd taxi image
};

const VehiclesTranslations = {
  [VehicleType.ECONOMIC]: {
    label: 'économique',
    description: 'Économique, rapide et fiable',
  },
  [VehicleType.PREMIUM]: {
    label: 'premium',
    description: 'Voitures spacieuses et chauffeurs les mieux notés',
  },
  [VehicleType.VAN]: {
    label: 'van',
    description: "Véhicules haut de gamme jusqu'à 6 passagers",
  },
  [VehicleType.TAXI]: {
    label: 'taxi',
    description: 'Taxi, paiement du trajet sur place',
  },
};
interface ICarProps {
  price: number;
  vehicle: IVehicle;
}

const Car: React.FC<ICarProps> = ({ price, vehicle }) => {
  const [selectedVehicle, setSelectedVehicle] = useRecoilState(vehicleState);
  const vehicleTexts = VehiclesTranslations[vehicle.type];

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.car,
        selectedVehicle?.type === vehicle.type && styles.selected,
      ]}
      onPress={() => setSelectedVehicle(vehicle)}>
      <Image
        source={CarsImages[vehicle.type]}
        style={styles.image}
        width={80}
        height={50}
      />
      <View style={styles.content}>
        <View style={styles.text}>
          <Text style={styles.type}>{vehicleTexts.label}</Text>
          {price > 0 && <Text style={styles.price}>{price} DJF</Text>}
        </View>
        <Text style={styles.description}>{vehicleTexts.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Car;

const styles = StyleSheet.create({
  car: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacer2,
    paddingLeft: layout.spacer1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.primary,
    borderRadius: border.radius2,
  },
  content: {
    marginLeft: layout.spacer3,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('screen').width - 135,
    flexWrap: 'wrap',
  },
  type: {
    fontSize: font.fontSize2,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: font.fontSize1,
    color: colors.grey2,
    maxWidth: Dimensions.get('screen').width - 135,
    flexWrap: 'wrap',
  },
  price: {
    fontWeight: '700',
    fontSize: font.fontSize3,
    marginRight: layout.spacer5,
  },
  image: {
    width: 80,
    height: 50,
  },
});
