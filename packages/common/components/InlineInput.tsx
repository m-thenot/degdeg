import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { colors, font } from '@dagdag/common/theme';

interface IInlineInputProps extends TextInputProps {
  label: string;
  name: string;
  control: Control<FieldValues, object>;
  initialValue?: string;
  rules: any;
}

export const InlineInput: React.FC<IInlineInputProps> = ({
  label,
  name,
  control,
  rules,
  initialValue = '',
  ...props
}) => {
  const styles = createStyles();
  return (
    <Controller
      control={control}
      defaultValue={initialValue}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.inlineInput}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={text => onChange(text)}
            defaultValue={initialValue}
            {...props}
          />
        </View>
      )}
      rules={rules}
    />
  );
};

const createStyles = () => {
  return StyleSheet.create({
    inlineInput: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.grey1,
      minHeight: 50,
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
  });
};
