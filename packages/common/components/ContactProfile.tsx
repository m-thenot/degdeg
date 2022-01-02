import React from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';
import PhotoUser from '@assets/icons/photo-user.svg';
import Start from '@dagdag/common/assets/icons/star.svg';
import { colors, font, layout } from '@dagdag/common/theme';

interface IContactProfileProps {
  firstName: string;
  image?: string;
  rating?: number;
}

export const ContactProfile: React.FC<IContactProfileProps> = ({
  firstName,
  image,
  rating,
}) => {
  const styles = createStyles();
  return (
    <View style={styles.contact}>
      {image ? (
        <Image
          width={70}
          height={70}
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      ) : (
        <PhotoUser height={70} width={70} />
      )}
      <View style={styles.contactText}>
        <Text style={styles.name}>{firstName}</Text>
        {rating && (
          <View style={styles.scoreContainer}>
            <Start height={13} width={13} />
            <Text style={styles.score}>{rating}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = () =>
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
      fontSize: font.fontSize2,
      color: colors.black,
      fontWeight: '700',
    },
  });
