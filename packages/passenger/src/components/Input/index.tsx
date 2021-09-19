import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { colors, layout, border, font } from '@dagdag/common/theme';

interface IInput extends TextInputProps {
  label: string;
  name: string;
  control: Control<FieldValues, object>;
  error: {
    message: string;
  };
  rules: any;
}

const Input: React.FC<IInput> = ({
  label,
  name,
  control,
  error,
  rules,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={text => onChange(text)}
            {...props}
          />
          {error && <Text style={styles.error}>{error.message}</Text>}
        </>
      )}
      rules={rules}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: layout.spacer3,
    marginBottom: layout.spacer2,
  },
  input: {
    backgroundColor: colors.grey4,
    borderRadius: border.radius3,
    paddingVertical: layout.spacer3,
    paddingHorizontal: layout.spacer3,
    fontSize: font.fontSize2,
    borderWidth: 1,
    borderColor: colors.grey1,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: layout.spacer1,
    color: colors.error,
  },
});
