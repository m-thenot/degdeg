import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerNavigatorParamList } from '@internalTypes/navigation';
import { colors, font, layout } from '@dagdag/common/theme';
import { BackHeader, Button, Input } from '@dagdag/common/components';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useFirebaseAuthentification from '@hooks/useFirebaseAuthentification';
import { sendEmail } from '@dagdag/common/services';
import DGToast, { ToastTypes } from '@utils/toast';
import { DRIVER } from '@dagdag/common/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Help: React.FC<DrawerScreenProps<DrawerNavigatorParamList, 'help'>> = ({
  navigation,
}) => {
  const { user } = useFirebaseAuthentification();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          navigation={navigation}
          title="Besoin d'aide ?"
          marginTop={insets.top}
          hasPaddingHorizontal
        />
      ),
    });
  }, []);

  const onSubmit = async ({ message }) => {
    const email = {
      from: user?.email,
      firstName: user?.firstName,
      uid: user?.uid,
      message: message,
      userType: DRIVER as typeof DRIVER,
    };
    const result = await sendEmail(email);
    reset();
    if (result.success) {
      DGToast.show(ToastTypes.DG_SUCCESS, {
        message: 'Votre email a été envoyé avec succès !',
      });
    } else {
      DGToast.show(ToastTypes.DG_ERROR, {
        message: "Une erreur innattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          extraScrollHeight={25}
          enableOnAndroid>
          <View style={{ flex: 1 }}>
            <Text style={styles.headline}>
              Vous avez eu un problème de paiement ? Vous n'arrivez pas à
              utiliser l'application ? Ou vous avez besoin d'un renseignement ?
              Envoyez nous un message et on vous répondra aussi vite que
              possible !
            </Text>
            <Input
              label="Votre message"
              name="message"
              multiline
              control={control}
              error={errors?.message}
              rules={{
                required: {
                  value: true,
                  message: 'Ce champ est requis.',
                },
              }}
            />

            <View style={styles.separator} />

            <Button
              text="Envoyer"
              disabled={!isDirty}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: layout.spacer9,
    paddingBottom: layout.spacer4,
  },
  headline: {
    fontSize: font.fontSize2,
    color: colors.black,
    marginBottom: layout.spacer2,
  },
  separator: {
    flex: 1,
    minHeight: layout.spacer3,
  },
});
