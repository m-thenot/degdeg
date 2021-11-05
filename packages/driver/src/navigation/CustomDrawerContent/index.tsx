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
import { logout } from '@services/driver';
import { layout, colors, font } from '@dagdag/common/theme';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { user } = useFirebaseAuthentication();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View style={styles.userContainer}>
        <EditIcon
          height={50}
          width={50}
          style={styles.edit}
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
        <Text style={styles.phoneNumber}>
          {user?.phoneNumber &&
            parsePhoneNumber(user.phoneNumber)?.formatInternational()}
        </Text>
      </View>
      <View style={styles.menu}>
        <DrawerItem
          label="Historique"
          style={styles.item}
          labelStyle={styles.label}
          onPress={() => {
            props.navigation.navigate('history');
          }}
        />
        <DrawerItem
          label="Mon portefeuille"
          style={styles.item}
          labelStyle={styles.label}
          onPress={() => {
            props.navigation.navigate('wallet');
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
    height: 200,
    paddingHorizontal: layout.spacer5,
    paddingTop: layout.spacer7,
    position: 'relative',
  },
  name: {
    color: colors.white,
    fontSize: font.fontSize3,
    fontWeight: '700',
    marginTop: layout.spacer3,
    marginBottom: layout.spacer1,
  },
  phoneNumber: {
    color: colors.white,
    fontSize: font.fontSize2,
  },
  edit: {
    position: 'absolute',
    top: 43,
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
