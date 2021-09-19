import React from 'react';
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { View, StyleSheet } from 'react-native';
import { colors, border } from '@dagdag/common/theme';

const BottomSheetBackground = ({ style }) => {
  return <View style={[styles.bottomSheetBackground, { ...style }]} />;
};

interface ICustomBottomSheetProps extends BottomSheetProps {
  sheetRef?: any;
}

const CustomBottomSheet: React.FC<ICustomBottomSheetProps> = ({
  sheetRef = null,
  ...props
}) => {
  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      style={styles.bottomSheet}
      backgroundComponent={backgroundProps => (
        <BottomSheetBackground style={backgroundProps.style} />
      )}
      keyboardBehavior="extend"
      {...props}>
      {props.children}
    </BottomSheet>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    borderRadius: 100,
  },
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderRadius: border.radius4,
  },
});
