import React, { useState } from 'react';
import {
  ViewStyle,
  StyleProp,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import StarIcon from '@dagdag/common/assets/icons/rating.svg';
import { layout, colors, font } from '@dagdag/common/theme';
import PhotoUser from '@assets/icons/photo-user.svg';
import { IPublicDriver, IUser } from '../types';
import { RoundBottom } from './RoundBottom';
import { Button } from './Button';

interface IRating {
  style?: StyleProp<ViewStyle>;
  personToBeEvaluated: IUser | IPublicDriver;
  onSubmit: (rating: number) => void;
  text: string;
}

const Rating: React.FC<IRating> = ({
  style,
  personToBeEvaluated,
  onSubmit,
  text,
}) => {
  const [rating, setRating] = useState(5);
  const styles = createStyles();

  return (
    <RoundBottom customStyle={style}>
      <View style={styles.passenger}>
        {personToBeEvaluated.image ? (
          <Image
            width={100}
            height={100}
            source={{
              uri: personToBeEvaluated?.image,
            }}
          />
        ) : (
          <PhotoUser height={90} width={90} />
        )}

        <Text style={styles.firstName}>{personToBeEvaluated.firstName}</Text>
      </View>

      <Text style={styles.title}>{text}</Text>
      <View style={styles.rates}>
        {[1, 2, 3, 4, 5].map((value, index) => (
          <StarIcon
            key={index}
            onPress={() => setRating(value)}
            width={40}
            height={40}
            style={styles.rate}
            fill={rating >= value ? colors.primary : colors.grey1}
          />
        ))}
      </View>
      <Button text="Envoyer" onPress={() => onSubmit(rating)} />
    </RoundBottom>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    passenger: {
      alignItems: 'center',
    },
    firstName: {
      fontSize: font.fontSize3,
      color: colors.black,
      fontWeight: '700',
      marginTop: layout.spacer2,
    },
    title: {
      fontSize: font.fontSize2,
      textAlign: 'center',
      color: colors.black,
      marginVertical: layout.spacer4,
    },
    rates: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: layout.spacer5,
    },
    rate: {
      marginHorizontal: layout.spacer1,
    },
  });
};

export default Rating;
