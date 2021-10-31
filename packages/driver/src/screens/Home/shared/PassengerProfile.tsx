import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import PhotoUser from '@assets/icons/photo-user.svg';
import Start from '@dagdag/common/assets/icons/star.svg';
import { colors, font, layout } from '@dagdag/common/theme';

interface PassengerProfile {
  firstName: string;
}

const PassengerProfile: React.FC<PassengerProfile> = ({ firstName }) => {
  return (
    <View style={styles.passenger}>
      <PhotoUser height={50} width={50} />
      <View style={styles.passengerText}>
        <Text style={styles.name}>{firstName}</Text>
        <View style={styles.scoreContainer}>
          <Start height={13} width={13} />
          <Text style={styles.score}>4.8</Text>
        </View>
      </View>
    </View>
  );
};

export default PassengerProfile;

const styles = StyleSheet.create({
  passenger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
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
