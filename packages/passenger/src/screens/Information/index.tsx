import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Platform,
  View,
} from 'react-native';
import globalStyles from '@theme/globalStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@internalTypes/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@dagdag/common/components';
import { EMAIL_REGEX } from '@dagdag/common/constants';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { createUser } from '@services/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { layout, font, headerHeight } from '@dagdag/common/theme';

interface IData {
  firstName: string;
  lastName: string;
  email: string;
}

const Information: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'information'>
> = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const { user } = useFirebaseAuthentication();
  const [submitHasFailed, setSubmitHasFailed] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: IData) => {
    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      createUser({ ...data, phoneNumber: user?.phoneNumber, uid: user?.uid })
        .then(() => {
          navigation.navigate('main');
        })
        .catch(() => {
          setSubmitHasFailed(true);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? headerHeight + 5 : headerHeight + 105
        }
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <KeyboardAwareScrollView contentContainerStyle={styles.contentScroll}>
          <View style={styles.main}>
            <Text style={styles.title}>Saisissez vos informations</Text>
            <Input
              name="firstName"
              label="Prénom"
              control={control}
              error={errors?.firstName}
              rules={{
                required: {
                  value: true,
                  message: 'Ce champ est requis.',
                },
              }}
            />
            <Input
              name="lastName"
              label="Nom"
              control={control}
              error={errors?.name}
              rules={{
                required: {
                  value: true,
                  message: 'Ce champ est requis.',
                },
              }}
            />
            <Input
              name="email"
              label="Adresse email"
              control={control}
              error={errors?.email}
              autoCompleteType="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              rules={{
                required: {
                  value: true,
                  message: 'Ce champ est requis.',
                },
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Cette adresse email n'est pas valide.",
                },
              }}
            />
            {submitHasFailed && (
              <Text style={[globalStyles.error, styles.unexpectedError]}>
                Une erreur inattendue s'est produite. Veuillez réessayer.
              </Text>
            )}
          </View>
          <Button text="Suivant" onPress={handleSubmit(onSubmit)} />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Information;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
  },
  contentScroll: {
    flexGrow: 1,
  },
  main: {
    flex: 1,
    marginTop: layout.marginTop,
    marginBottom: layout.spacer3,
  },
  title: {
    fontSize: font.fontSize4,
    fontWeight: '700',
    marginBottom: layout.spacer3,
  },
  unexpectedError: {
    marginTop: layout.spacer4,
  },
});
