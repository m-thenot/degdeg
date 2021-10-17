import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, Text } from 'react-native';
import Map from '@components/Map';
import { requestUserPermission, saveTokenToDatabase } from '@services/user';
import messaging from '@react-native-firebase/messaging';
import { useLocation } from '@context/location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { RoundBottom } from '@dagdag/common/components';
import globalStyles from '@theme/globalStyles';
import { colors, font } from '@dagdag/common/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Home: React.FC<DrawerNavigationProp<DrawerNavigatorParamList, 'home'>> =
  () => {
    const { location } = useLocation();
    const [order, setOrder] = useState<any>();

    useEffect(() => {
      requestUserPermission();
      messaging()
        .getToken()
        .then(token => {
          return saveTokenToDatabase(token);
        });

      return messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token);
      });
    }, []);

    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        setOrder(remoteMessage.data);

        Alert.alert(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });

      return unsubscribe;
    }, []);

    return (
      <SafeAreaView style={styles.container}>
        <Map showsUserLocation />
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.buttonGo}
          onPress={() => 0}>
          <Text style={styles.textGo}>GO</Text>
        </TouchableOpacity>
        <RoundBottom>
          <Text style={styles.text}>
            Vous êtes <Text style={globalStyles.bold}>hors-ligne</Text>.
          </Text>
          <Text style={styles.text}>
            Appuyez sur <Text style={globalStyles.bold}>Go</Text> pour commencer
            à accepter des courses.
          </Text>
        </RoundBottom>
      </SafeAreaView>
    );
  };

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: font.fontSize2,
    color: colors.black,
  },
  buttonGo: {
    position: 'absolute',
    bottom: 100,
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
  },
  textGo: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: font.fontSize4,
  },
});
