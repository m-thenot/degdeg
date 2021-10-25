import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { colors, font, layout } from '../theme';
import { Button } from './Button';
import { RoundBottom } from './RoundBottom';

interface CommonProps {
  onPressOutside?: () => void;
}

interface CustomModalProps extends CommonProps {
  isCustom: boolean;
  question?: never;
  primaryText?: never;
  onPressPrimary?: never;
  secondaryText?: never;
  onPressSecondary?: never;
}

interface BasicModalProps extends CommonProps {
  onPressOutside?: () => void;
  isCustom?: never;
  question: string;
  primaryText: string;
  onPressPrimary: () => void;
  secondaryText: string;
  onPressSecondary: () => void;
}

type IModalProps = CustomModalProps | BasicModalProps;

export const Modal: React.FC<IModalProps> = ({
  onPressOutside = () => 0,
  children,
  isCustom,
  question,
  primaryText,
  onPressPrimary,
  secondaryText,
  onPressSecondary,
}) => {
  const styles = createStyles();

  return (
    <>
      <Pressable style={styles.background} onPress={onPressOutside} />
      <RoundBottom customStyle={styles.bottom}>
        {isCustom ? (
          children
        ) : (
          <>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.actions}>
              <Button
                text={primaryText!}
                style={styles.button}
                onPress={onPressPrimary!}
              />
              <Button
                type="secondary"
                style={styles.button}
                text={secondaryText!}
                onPress={onPressSecondary!}
              />
            </View>
          </>
        )}
      </RoundBottom>
    </>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      flex: 1,
      backgroundColor: 'rgba(0,0,0, 0.6)',
      zIndex: 30,
    },
    bottom: {
      zIndex: 40,
    },
    question: {
      color: colors.black,
      fontSize: font.fontSize2,
      fontWeight: 'bold',
      marginBottom: layout.spacer5,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      width: '47%',
    },
  });
};
