import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CarType } from '@constants/car';
import { useRecoilState } from 'recoil';
import { carState } from '@stores/car.atom';
import { colors, layout, font, border } from '@dagdag/common/theme';

interface ICarProps {
  price: number;
  type: CarType;
  label: string;
  description: string;
  image: ImageSourcePropType;
}

const Car: React.FC<ICarProps> = ({
  price,
  type,
  description,
  image,
  label,
}) => {
  const [car, setCar] = useRecoilState(carState);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.car, car?.type === type && styles.selected]}
      onPress={() => setCar({ price, type })}>
      <Image source={image} width={80} height={50} />
      <View style={styles.content}>
        <View style={styles.text}>
          <Text style={styles.type}>{label}</Text>
          <Text style={styles.price}>{price}€</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
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
});
