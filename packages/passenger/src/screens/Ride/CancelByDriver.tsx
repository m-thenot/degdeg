import { Button, Modal } from '@dagdag/common/components';
import { colors, font, layout } from '@dagdag/common/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CancelByDriver: React.FC = () => {
  const navigation = useNavigation<any>();

  const onPress = () => {
    navigation.navigate('booking', {
      screen: 'home',
    });
  };

  return (
    <Modal isCustom>
      <Text style={styles.lateText}>
        Oups... le chauffeur a finalement annulé la course. Si vous avez déjà
        payé votre course, nous allons procéder au remboursement sous 24h.
      </Text>
      <Text style={styles.lateText}>
        Si vous le souhaitez, vous pouvez maintenant chercher un nouveau
        chauffeur.
      </Text>
      <Button text="Retour à l'accueil" onPress={onPress} />
    </Modal>
  );
};

export default CancelByDriver;

const styles = StyleSheet.create({
  lateText: {
    fontSize: font.fontSize2,
    color: colors.black,
    marginBottom: layout.spacer5,
  },
});
