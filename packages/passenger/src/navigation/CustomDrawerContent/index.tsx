import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Text, StyleSheet, View, Image } from 'react-native';
import { LinkButton } from '@dagdag/common/components';
import PhotoUser from '@assets/icons/photo-user.svg';
import EditIcon from '@assets/icons/ic_edit.svg';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import parsePhoneNumber from 'libphonenumber-js';
import { logout } from '@services/user';
import { layout, colors, font } from '@dagdag/common/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StarIcon from '@dagdag/common/assets/icons/rating.svg';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { user } = useFirebaseAuthentication();
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View
        style={[
          styles.userContainer,
          { paddingTop: insets.top + layout.spacer7 },
        ]}>
        <EditIcon
          height={50}
          width={50}
          style={[styles.edit, { top: insets.top + 45 }]}
          onPress={() => props.navigation.navigate('user')}
        />
        {user?.image ? (
          <Image
            width={80}
            height={80}
            style={styles.image}
            source={{
              uri: user.image,
            }}
          />
        ) : (
          <PhotoUser height={80} width={80} />
        )}
        <Text style={styles.name}>{user?.firstName}</Text>
        {user?.rating && (
          <View style={styles.rating}>
            <StarIcon width={12} height={12} fill="#FFB800" />
            <Text style={styles.ratingNumber}>
              {user?.rating.overall.toFixed(2)}
            </Text>
          </View>
        )}
        <Text style={styles.phoneNumber}>
          {user?.phoneNumber &&
            parsePhoneNumber(user.phoneNumber)?.formatInternational()}
        </Text>
      </View>
      <View style={styles.menu}>
        <DrawerItem
          label="Mes courses"
          style={styles.item}
          labelStyle={styles.label}
          onPress={() => {
            props.navigation.navigate('myRides');
          }}
        />
        <DrawerItem
          label="Paiement"
          style={styles.item}
          labelStyle={styles.label}
          onPress={() => {
            props.navigation.navigate('payment');
          }}
        />
        <DrawerItem
          label="Besoin d'aide ?"
          style={styles.item}
          labelStyle={styles.label}
          onPress={() => {
            props.navigation.navigate('help');
          }}
        />
        {__DEV__ && (
          <DrawerItem
            label="Dev"
            style={styles.item}
            labelStyle={styles.label}
            onPress={() => {
              props.navigation.navigate('dev');
            }}
          />
        )}
      </View>
      <LinkButton
        text="Se déconnecter"
        style={styles.logout}
        onPress={() => logout()}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  userContainer: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: layout.spacer5,
    paddingBottom: layout.spacer6,
  },
  name: {
    color: colors.white,
    fontSize: font.fontSize3,
    fontWeight: '700',
    marginTop: layout.spacer3,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  ratingNumber: {
    color: colors.white,
    fontSize: font.fontSize1_5,
    fontWeight: '700',
    marginLeft: layout.spacer1,
    paddingTop: 2,
  },
  phoneNumber: {
    color: colors.white,
    fontSize: font.fontSize2,
    marginTop: layout.spacer2,
  },
  edit: {
    position: 'absolute',
    left: 80,
    zIndex: 15,
  },
  menu: {
    flex: 1,
    marginTop: layout.spacer4,
  },
  item: {
    marginLeft: -10,
    paddingHorizontal: layout.spacer5,
  },
  label: {
    fontSize: font.fontSize2,
    color: colors.black,
    textTransform: 'uppercase',
  },
  logout: {
    paddingHorizontal: layout.spacer5,
    marginBottom: layout.spacer7,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
  },
});
