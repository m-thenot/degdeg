import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from '@dagdag/common/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@internalTypes/navigation';
import useFirebaseAuthentication from '@hooks/useFirebaseAuthentification';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import globalStyles from '@theme/globalStyles';
import parsePhoneNumber from 'libphonenumber-js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { colors, layout, font } from '@dagdag/common/theme';
import analytics from '@react-native-firebase/analytics';

const Verification: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'verification'>
> = ({ route }) => {
  const headerHeight = useHeaderHeight();
  const { confirmation, setConfirmation } = useFirebaseAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const resendCode = async () => {
    const newConfirmation = await auth().signInWithPhoneNumber(
      route.params.phoneNumber,
    );
    setConfirmation?.(newConfirmation);
  };

  const confirmCode = async () => {
    setIsLoading(true);
    try {
      await confirmation!.confirm(value);
      await analytics().logSignUp({
        method: 'phone',
      });
    } catch {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? headerHeight + 5 : -headerHeight
        }
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.main}>
          <Text style={styles.title}>
            Saisissez le code reçu à votre numéro de téléphone
          </Text>
          <Text style={styles.subtitle}>
            Le code a été envoyé au numéro{' '}
            {route.params.phoneNumber &&
              parsePhoneNumber(route.params.phoneNumber)?.formatInternational()}
            .
          </Text>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[
                  styles.cellContainer,
                  (Boolean(symbol) || isFocused) && styles.focusCell,
                ]}>
                <Text
                  style={styles.cell}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity onPress={resendCode}>
            <Text style={styles.resendText}>Renvoyer le code </Text>
          </TouchableOpacity>
          {error && (
            <Text style={[styles.error, globalStyles.error]}>
              Ce code n'est pas valide.
            </Text>
          )}
        </View>
        <Button
          isLoading={isLoading}
          text="Suivant"
          onPress={confirmCode}
          style={styles.button}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: {
    flex: 1,
    marginHorizontal: layout.marginHorizontal,
  },
  main: {
    flex: 1,
    marginTop: layout.marginTop + 15,
  },
  title: {
    fontSize: font.fontSize4,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.grey3,
    marginTop: layout.spacer3,
  },
  codeFieldRoot: { marginVertical: layout.spacer6 },
  cellContainer: {
    borderBottomWidth: 2,
    borderColor: colors.black,
    marginRight: layout.spacer4,
    flex: 1,
  },
  cell: {
    fontSize: 30,
    textAlign: 'center',
    height: 50,
    color: colors.primary,
  },
  focusCell: {
    borderColor: colors.primary,
  },
  resendText: {
    color: colors.grey2,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  error: {
    marginTop: layout.spacer3,
  },
  button: {
    marginBottom: layout.spacer3,
  },
});
