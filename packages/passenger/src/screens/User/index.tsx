import { EMAIL_REGEX } from '@dagdag/common/constants';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, layout } from '@dagdag/common/theme';
import globalStyles from '@theme/globalStyles';
import { BackHeader, Button, InlineInput } from '@dagdag/common/components';
import PenIcon from '@dagdag/common/assets/icons/pen.svg';
import PhotoUser from '@assets/icons/photo-user.svg';
import { updateUser } from '@services/user';
import { useFocusEffect } from '@react-navigation/native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native';
import { Logger } from '@dagdag/common/utils';

const options: ImageLibraryOptions = {
  mediaType: 'photo',
};

interface IData {
  firstName: string;
  name: string;
  email: string;
}

const User: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'user'>> = ({
  navigation,
}) => {
  const { user } = useFirebaseAuthentication();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();
  const hasError = !Boolean(
    Object.keys(errors).length === 0 && errors.constructor === Object,
  );
  const reference = useRef(storage().ref(`drivers/${user?.uid}`)).current;
  const [image, setImage] = useState<string | undefined>(user?.image);
  const [isNewImage, setIsNewImage] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Profil"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsNewImage(false);
    }, []),
  );

  const onSubmit = (data: IData) => {
    const getImage = async () => {
      const url = await storage().ref(`drivers/${user?.uid}`).getDownloadURL();
      updateUser({ image: url });
    };

    if (isNewImage) {
      reference
        .putFile(image!)
        .then(() => {
          getImage();
        })
        .catch(e => {
          Logger.error(e);
        });
    }

    if (!hasError) {
      updateUser(data);
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        reset(user!);
      };
    }, []),
  );

  const handleChoosePhoto = () => {
    launchImageLibrary(options, response => {
      const newImage = response?.assets?.[0].uri;
      if (newImage) {
        setImage(newImage);
        setIsNewImage(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.avatar} onPress={handleChoosePhoto}>
        <PenIcon
          height={50}
          width={50}
          style={styles.edit}
          onPress={handleChoosePhoto}
        />
        {user?.image ? (
          <Image
            width={100}
            height={100}
            style={styles.image}
            source={{
              uri: image,
            }}
          />
        ) : (
          <PhotoUser height={100} width={100} />
        )}
      </Pressable>
      <InlineInput
        name="firstName"
        initialValue={user?.firstName}
        label="Prénom"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Le prénom est requis.',
          },
        }}
      />
      <InlineInput
        name="name"
        initialValue={user?.lastName}
        label="Nom"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Le nom est requis.',
          },
        }}
      />
      <InlineInput
        name="email"
        initialValue={user?.email}
        label="Adresse Email"
        control={control}
        rules={{
          required: {
            value: true,
            message: "L'adresse email est requis.",
          },
          pattern: {
            value: EMAIL_REGEX,
            message: "Cette adresse email n'est pas valide.",
          },
        }}
      />

      {hasError && (
        <Text style={[globalStyles.error, styles.error]}>
          {errors[Object.keys(errors)[0]]?.message}
        </Text>
      )}

      <View style={{ flex: 1 }} />

      <Button
        disabled={!isDirty && !isNewImage}
        text="Sauvegarder"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: layout.spacer5,
  },
  edit: {
    position: 'absolute',
    top: 0,
    right: -20,
    zIndex: 40,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  inlineInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey1,
  },
  label: {
    fontSize: font.fontSize2,
    color: colors.grey3,
  },
  input: {
    color: colors.black,
    fontSize: font.fontSize2,
    includeFontPadding: false,
    flex: 1,
    textAlign: 'right',
  },
  button: {
    marginBottom: layout.spacer3,
  },
  error: {
    marginTop: layout.spacer4,
  },
});
