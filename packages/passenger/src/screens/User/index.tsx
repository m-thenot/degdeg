import { EMAIL_REGEX } from '@dagdag/common/constants';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, layout } from '@dagdag/common/theme';
import globalStyles from '@theme/globalStyles';
import { Button, InlineInput } from '@dagdag/common/components';
import PenIcon from '@dagdag/common/assets/icons/pen.svg';
import PhotoUser from '@assets/icons/photo-user.svg';
import { updateUser } from '@services/user';
import { useFocusEffect } from '@react-navigation/native';

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

  const onSubmit = (data: IData) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatar}>
        <PenIcon height={50} width={50} style={styles.edit} />
        <PhotoUser height={100} width={100} />
      </View>
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

      <Button
        disabled={!isDirty}
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
    position: 'absolute',
    bottom: 10,
    width: '100%',
    marginHorizontal: layout.marginHorizontal,
  },
  error: {
    marginTop: layout.spacer4,
  },
});
