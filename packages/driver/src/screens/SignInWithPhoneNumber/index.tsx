import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { Button } from '@dagdag/common/components';
import PhoneInput from 'react-native-phone-number-input';
import auth from '@react-native-firebase/auth';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@internalTypes/navigation';
import globalStyles from '@theme/globalStyles';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, font, headerHeight } from '@dagdag/common/theme';

const SignInWithPhoneNumber: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'signInWithPhoneNumber'>
> = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState<boolean | null>();
  const phoneInput = useRef<PhoneInput>(null);
  const { setConfirmation } = useFirebaseAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation?.(confirmation);
      navigation.navigate('verification', { phoneNumber });
    } catch (e) {
      setIsLoading(false);
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
        <View style={styles.main}>
          <Text style={styles.title}>
            Saisissez votre numéro de téléphone portable
          </Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            placeholder="Numéro de téléphone"
            containerStyle={styles.phoneNumber}
            defaultCode="DJ"
            layout="first"
            onChangeText={text => {
              setValue(text);
            }}
            onChangeFormattedText={text => {
              setFormattedValue(text);
            }}
            withShadow
            autoFocus
            filterProps={{ placeholder: 'Entrer un pays : ' }}
          />
          {valid === false && (
            <Text style={globalStyles.error}>
              Votre numéro de téléphone est invalide.
            </Text>
          )}
        </View>
        <Text style={styles.text}>
          Si vous continuez, nous vous enverrons un code de vérification pour
          nous assurer que vous êtes bien réel. Des frais de messagerie SMS et
          de transfert de donner peuvent s'appliquer.
        </Text>
        <Button
          text="Suivant"
          isLoading={isLoading}
          style={styles.button}
          onPress={() => {
            setIsLoading(true);
            const checkValid = phoneInput.current?.isValidNumber(value);
            setValid(checkValid ? checkValid : false);
            if (checkValid) {
              signInWithPhoneNumber(formattedValue);
            } else {
              setIsLoading(false);
            }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInWithPhoneNumber;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: { flex: 1, marginHorizontal: layout.marginHorizontal },
  main: { flex: 1, marginTop: layout.marginTop },
  title: {
    fontSize: font.fontSize4,
    fontWeight: '700',
  },
  text: {
    color: colors.grey2,
    marginBottom: layout.spacer3,
  },
  phoneNumber: {
    marginVertical: layout.spacer6,
    width: 'auto',
  },
  button: {
    marginBottom: layout.spacer3,
  },
});
