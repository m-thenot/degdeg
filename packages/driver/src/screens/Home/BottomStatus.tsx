import React from 'react';
import { RoundBottom } from '@dagdag/common/components';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import globalStyles from '@theme/globalStyles';
import { colors, font, layout } from '@dagdag/common/theme';
import { useRecoilState } from 'recoil';
import { isOnlineState } from '@stores/driver.atom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomStatus: React.FC = () => {
  const [isOnline, setisOnline] = useRecoilState(isOnlineState);
  const insets = useSafeAreaInsets();

  return (
    <>
      {isOnline ? (
        <RoundBottom customStyle={{ bottom: insets.bottom }}>
          <Text style={styles.text}>
            Vous êtes <Text style={globalStyles.bold}>en ligne</Text>.
          </Text>
          <Text style={styles.text}>
            Vous serez notifié dès qu'une nouvelle course sera disponible.
          </Text>
          <View style={styles.indicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.text, styles.textSearch]}>
              Recherche de courses en cours...
            </Text>
          </View>
        </RoundBottom>
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={0.4}
            style={[styles.buttonGo, { bottom: insets.bottom + 130 }]}
            onPress={() => {
              setisOnline(true);
            }}>
            <Text style={styles.textGo}>GO</Text>
          </TouchableOpacity>
          <RoundBottom customStyle={{ bottom: insets.bottom }}>
            <Text style={styles.text}>
              Vous êtes <Text style={globalStyles.bold}>hors-ligne</Text>.
            </Text>
            <Text style={styles.text}>
              Appuyez sur <Text style={globalStyles.bold}>Go</Text> pour
              commencer à accepter des courses.
            </Text>
          </RoundBottom>
        </>
      )}
    </>
  );
};

export default BottomStatus;

const styles = StyleSheet.create({
  text: {
    fontSize: font.fontSize2,
    color: colors.black,
  },
  buttonGo: {
    position: 'absolute',
    backgroundColor: colors.primary,
    width: 90,
    height: 90,
    borderRadius: 90,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: colors.grey3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    zIndex: 10,
  },
  textGo: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: font.fontSize4,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: layout.spacer3,
  },
  textSearch: {
    marginLeft: layout.spacer3,
  },
});
