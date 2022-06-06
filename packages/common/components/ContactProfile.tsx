import React from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';
import PhotoUser from '@assets/icons/photo-user.svg';
import Start from '@dagdag/common/assets/icons/star.svg';
import { colors, font, layout } from '@dagdag/common/theme';

interface IContactProfileProps {
  firstName: string;
  image?: string;
  rating?: number;
  car?: string;
  size?: 'large' | 'small';
}

export const ContactProfile: React.FC<IContactProfileProps> = ({
  firstName,
  image,
  car,
  rating,
  size = 'small',
}) => {
  const styles = createStyles(size);
  const sizeMutliplicator = size === 'large' ? 1.2 : 1;
  return (
    <View style={styles.contact}>
      {image ? (
        <Image
          width={sizeMutliplicator * 70}
          height={sizeMutliplicator * 70}
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      ) : (
        <PhotoUser
          height={sizeMutliplicator * 70}
          width={sizeMutliplicator * 70}
        />
      )}

      <View style={styles.contactText}>
        <Text style={styles.name}>{firstName}</Text>
        {car && <Text style={styles.car}>{car}</Text>}
        {rating && (
          <View style={styles.scoreContainer}>
            <Start
              height={sizeMutliplicator * 13}
              width={sizeMutliplicator * 13}
            />
            <Text style={styles.score}>{rating}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (size: string) =>
  StyleSheet.create({
    contact: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactText: {
      marginLeft: layout.spacer2,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 70,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    score: {
      marginLeft: layout.spacer1,
      marginTop: layout.spacer1,
    },
    name: {
      fontSize: size === 'large' ? font.fontSize3 : font.fontSize2,
      color: colors.black,
      fontWeight: '700',
    },
    car: {
      fontSize: font.fontSize1_5,
      color: colors.black,
    },
  });
