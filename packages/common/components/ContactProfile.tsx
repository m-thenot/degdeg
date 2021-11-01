import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import PhotoUser from '@assets/icons/photo-user.svg';
import Start from '@dagdag/common/assets/icons/star.svg';
import { colors, font, layout } from '@dagdag/common/theme';

interface IContactProfileProps {
  firstName: string;
}

export const ContactProfile: React.FC<IContactProfileProps> = ({
  firstName,
}) => {
  const styles = createStyles();
  return (
    <View style={styles.contact}>
      <PhotoUser height={50} width={50} />
      <View style={styles.contactText}>
        <Text style={styles.name}>{firstName}</Text>
        <View style={styles.scoreContainer}>
          <Start height={13} width={13} />
          <Text style={styles.score}>4.8</Text>
        </View>
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
